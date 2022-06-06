const axios = require('axios');
const { Storage } = require('@google-cloud/storage');
var path = require('path');
const uuid = require('uuid');

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_PRIVATE_KEY
  }
});

const bucket = storage.bucket(process.env.GCS_BUCKET);

const uuidv1 = uuid.v1;

const { Satwa } = require('../models');

const predictMain = async (req, res) => {
  // const getRandom = await axios.post('http://34.101.145.236:8080/predict/random');
  // const randomSatwa = getRandom.data;

  // if (randomSatwa.status) {
  //   return res
  //     .status(400)
  //     .json({
  //       status: 'fail',
  //       message: 'Tidak terdeteksi'
  //     });
  // }

  // const findSatwa = await Satwa.findOne({
  //   where: {
  //     nama: randomSatwa.nama
  //   }
  // });

  if (req.file) {
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.webp') {
      return res
        .status(404)
        .json({
          status: 'fail',
          message: 'Hanya dapat menggunakan file gambar (.png, .jpg, .jpeg atau .webp)'
        });
    }

    const newFilename = `${uuidv1()}-${req.file.originalname}`;
    const blob = bucket.file(`predict_uploads/${newFilename}`);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (error) => {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: error
        });
    });

    blobStream.on('finish', async () => {
      const filename = blob.name.replaceAll('predict_uploads/', '');;

      try {
        const getPrediction = await axios.post(process.env.API_PREDICT_HOST, {
          filename: filename
        });
        const predictedSatwa = getPrediction.data;

        const findSatwa = await Satwa.findOne({
          where: {
            nama: predictedSatwa.nama
          }
        });

        if (!findSatwa) {
          const satwa = await Satwa.create(predictedSatwa);
          return res.json(satwa);
        }

        res.json(findSatwa);
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({
            status: 'fail',
            message: 'Tidak terdeteksi'
          });
      }
    });

    blobStream.end(req.file.buffer);
  } else {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang diperlukan'
      });
  }
}

const predictRandom = async (req, res) => {
  const random_satwa = [{
    nama: 'Macan',
    nama_saintifik: 'Panthera Pardus Melas',
    lokasi: '',
    populasi: '',
    funfact: ''
  },
  {
    nama: 'Beruang Madu',
    nama_saintifik: 'Helarctos Malayanus',
    lokasi: '',
    populasi: '',
    funfact: ''
  },
  {
    nama: 'Gajah Asia',
    nama_saintifik: '',
    lokasi: '',
    populasi: '',
    funfact: ''
  },
  {
    nama: 'Burung',
    nama_saintifik: 'Buceroa Rhinoceros',
    lokasi: '',
    populasi: '',
    funfact: ''
  },
  {
    nama: 'Tapir',
    nama_saintifik: 'Tapirus Indicus',
    lokasi: '',
    populasi: '',
    funfact: ''
  },
  {
    nama: 'Bekantan',
    nama_saintifik: 'Nasalis Larvatus',
    lokasi: '',
    populasi: '',
    funfact: ''
  },
  {
    status: 'fail'
  }];

  const response = random_satwa[Math.floor(Math.random() * random_satwa.length)];

  res.json(response);
}

module.exports = {
  predictMain,
  predictRandom
};
