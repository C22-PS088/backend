const Validator = require('fastest-validator');
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

const { Satwa, Satwa_donasi, Satwa_gambar } = require('../models');

const v = new Validator();

const getAllSatwa = async (req, res) => {
  const satwa = await Satwa.findAll({
    include: Satwa_gambar
  });
  res.json(satwa);
}

const getSatwaById = async (req, res) => {
  const id = req.params.id;

  const satwa = await Satwa.findOne({
    where: {
      id: id
    },
    include: Satwa_gambar
  });

  if (!satwa) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data satwa tidak ditemukan'
      });
  }

  res.json(satwa);
}

const getSatwaByIdV2 = async (req, res) => {
  const id = req.params.id;

  const satwa = await Satwa.findByPk(id);

  if (!satwa) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data satwa tidak ditemukan'
      });
  }

  const gambar = await Satwa_gambar.findOne({
    where: {
      SatwaId: id
    }
  })

  const satwaReturn = JSON.parse(JSON.stringify(satwa));

  if (gambar) {
    satwaReturn.gambar = gambar.gambar;
  } else {
    satwaReturn.gambar = null;
  }

  res.json(satwaReturn);
}

const addSatwa = async (req, res) => {
  const schema = {
    nama: 'string',
    nama_saintifik: 'string|optional',
    lokasi: 'string|optional',
    populasi: 'string|optional',
    funfact: 'string|optional',
  }

  const satwa_detail = JSON.parse(req.body.data);

  const validate = v.validate(satwa_detail, schema);

  if (validate.length) {
    return res
      .status(400)
      .json(validate);
  }

  const {
    nama
  } = satwa_detail;

  if (nama === "") {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang diperlukan'
      });
  }

  if (req.file) {
    const ext_gambar_lokasi = path.extname(req.file.originalname).toLowerCase();

    if (ext_gambar_lokasi !== '.png' && ext_gambar_lokasi !== '.jpg' && ext_gambar_lokasi !== '.jpeg') {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Hanya dapat menggunakan file gambar (.png, .jpg atau .jpeg)'
        });
    }

    const newFilename_gambar_lokasi = `${uuidv1()}-${req.file.originalname}`;
    const blob_gambar_lokasi = bucket.file(newFilename_gambar_lokasi);
    const blobStream_gambar_lokasi = blob_gambar_lokasi.createWriteStream();

    blobStream_gambar_lokasi.on('error', (error) => {
      console.log(error);
    });

    blobStream_gambar_lokasi.on('finish', async () => {
      console.log('success');
    });

    blobStream_gambar_lokasi.end(req.file.buffer);

    satwa_detail.gambar_lokasi = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob_gambar_lokasi.name}`;
  }

  const satwa = await Satwa.create(satwa_detail);

  res.json(satwa);
}

const updateSatwa = async (req, res) => {
  const id = req.params.id;

  let satwa = await Satwa.findByPk(id);

  if (!satwa) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data satwa tidak ditemukan'
      });
  }

  const satwa_detail = JSON.parse(req.body.data);

  const schema = {
    nama: 'string|optional',
    nama_saintifik: 'string|optional',
    lokasi: 'string|optional',
    populasi: 'string|optional',
    funfact: 'string|optional',
  }

  const validate = v.validate(satwa_detail, schema);

  if (validate.length) {
    return res
      .status(400)
      .json(validate);
  }

  const {
    nama
  } = req.body;

  if (nama === "") {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang diperlukan'
      });
  }

  if (req.file) {
    const ext_gambar_lokasi = path.extname(req.file.originalname).toLowerCase();

    if (ext_gambar_lokasi !== '.png' && ext_gambar_lokasi !== '.jpg' && ext_gambar_lokasi !== '.jpeg') {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Hanya dapat menggunakan file gambar (.png, .jpg atau .jpeg)'
        });
    }

    const newFilename_gambar_lokasi = `${uuidv1()}-${req.file.originalname}`;
    const blob_gambar_lokasi = bucket.file(newFilename_gambar_lokasi);
    const blobStream_gambar_lokasi = blob_gambar_lokasi.createWriteStream();

    blobStream_gambar_lokasi.on('error', (error) => {
      console.log(error);
    });

    blobStream_gambar_lokasi.on('finish', async () => {
      console.log('success');
    });

    blobStream_gambar_lokasi.end(req.file.buffer);

    if (satwa.gambar_lokasi) {
      const gambar_lokasi_old = satwa.gambar_lokasi.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

      try {
        await bucket.file(gambar_lokasi_old).delete();
      } catch (error) {
        console.log(error);
      }
    }

    satwa_detail.gambar_lokasi = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob_gambar_lokasi.name}`;
  } else {
    satwa_detail.gambar_lokasi = satwa.gambar_lokasi;
  }

  satwa = await satwa.update(satwa_detail);

  res.json(satwa);
}

const deleteSatwa = async (req, res) => {
  const id = req.params.id;

  const satwa = await Satwa.findOne({
    where: {
      id: id
    },
    include: Satwa_gambar
  });

  if (!satwa) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data satwa tidak ditemukan'
      });
  }

  await Satwa_donasi.destroy({
    where: {
      SatwaId: satwa.id
    }
  });

  if (satwa.gambar_lokasi) {
    const gambar_lokasi_old = satwa.gambar_lokasi.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

    try {
      await bucket.file(gambar_lokasi_old).delete();
    } catch (error) {
      console.log(error);
    }
  }

  if (satwa.Satwa_gambars.length !== 0) {
    const satwa_gambars = satwa.Satwa_gambars;

    for (let satwa_gambar of satwa_gambars) {
      const gambar_old = satwa_gambar.gambar.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

      try {
        await Satwa_gambar.destroy({
          where: {
            id: satwa_gambar.id
          }
        });

        await bucket.file(gambar_old).delete();
      } catch (error) {
        console.log(error);
      }
    }
  }

  await satwa.destroy();

  res
    .status(200)
    .json({
      status: 'success',
      message: 'Data satwa telah terhapus'
    });
}

module.exports = {
  getAllSatwa,
  getSatwaById,
  getSatwaByIdV2,
  addSatwa,
  updateSatwa,
  deleteSatwa
};
