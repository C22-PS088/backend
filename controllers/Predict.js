const axios = require('axios');

const { Satwa, Satwa_gambar, Satwa_donasi } = require('../models');

const predictMain = async (req, res) => {
  const getRandom = await axios.post('http://localhost:3001/predict/random');
  const randomSatwa = getRandom.data;

  if (randomSatwa.status) {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Tidak terdeteksi'
      });
  }



  const findSatwa = await Satwa.findOne({
    where: {
      nama: randomSatwa.nama
    }
  });

  if (!findSatwa) {
    const satwa = await Satwa.create(randomSatwa);
    return res.json(satwa);
  }

  res.json(findSatwa);
}

const predictRandom = async (req, res) => {
  const random_satwa = [{
    nama: 'Macan',
    nama_saintifik: 'Panthera Pardus Melas',
    lokasi: '',
    populasi: null,
    funfact: ''
  },
  {
    nama: 'Beruang Madu',
    nama_saintifik: 'Helarctos Malayanus',
    lokasi: '',
    populasi: null,
    funfact: ''
  },
  {
    nama: 'Gajah Asia',
    nama_saintifik: '',
    lokasi: '',
    populasi: null,
    funfact: ''
  },
  {
    nama: 'Burung',
    nama_saintifik: 'Buceroa Rhinoceros',
    lokasi: '',
    populasi: null,
    funfact: ''
  },
  {
    nama: 'Tapir',
    nama_saintifik: 'Tapirus Indicus',
    lokasi: '',
    populasi: null,
    funfact: ''
  },
  {
    nama: 'Bekantan',
    nama_saintifik: 'Nasalis Larvatus',
    lokasi: '',
    populasi: null,
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
