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

const { Donasi } = require('../models');

const v = new Validator();

const getAllDonasi = async (req, res) => {
  const donasi = await Donasi.findAll();
  res.json(donasi);
}

const getDonasiById = async (req, res) => {
  const id = req.params.id;

  const donasi = await Donasi.findByPk(id);

  if (!donasi) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data donasi tidak ditemukan'
      });
  }

  res.json(donasi);
}

const addDonasi = async (req, res) => {
  const schema = {
    nama: 'string',
    deskripsi: 'string|optional',
    lokasi: 'string',
    kontak: 'string',
    website: 'string',
    rekening: 'string'
  }

  const donasi_detail = JSON.parse(req.body.data);

  const validate = v.validate(donasi_detail, schema);

  if (validate.length) {
    return res
      .status(400)
      .json(validate);
  }

  const {
    nama,
    lokasi,
    kontak,
    website,
    rekening
  } = donasi_detail;

  if (nama === "" || lokasi === "" || kontak === "" || website === "" || rekening === "") {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang diperlukan'
      });
  }

  if (req.file) {
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return res
        .status(404)
        .json({
          status: 'fail',
          message: 'Hanya dapat menggunakan file gambar (.png, .jpg atau .jpeg)'
        });
    }

    const newFilename = `${uuidv1()}-${req.file.originalname}`;
    const blob = bucket.file(newFilename);
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
      const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;

      donasi_detail.gambar = publicUrl;
      const donasi = await Donasi.create(donasi_detail);

      res.json(donasi);
    });

    blobStream.end(req.file.buffer);
  } else {
    const donasi = await Donasi.create(donasi_detail);

    res.json(donasi);
  }
}

const updateDonasi = async (req, res) => {
  const id = req.params.id;

  let donasi = await Donasi.findByPk(id);

  if (!donasi) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data donasi tidak ditemukan'
      });
  }

  const donasi_detail = JSON.parse(req.body.data);

  const schema = {
    nama: 'string|optional',
    deskripsi: 'string|optional',
    lokasi: 'string|optional',
    kontak: 'string|optional',
    website: 'string|optional',
    rekening: 'string|optional'
  }

  const validate = v.validate(donasi_detail, schema);

  if (validate.length) {
    return res
      .status(400)
      .json(validate);
  }

  const {
    nama,
    lokasi,
    kontak,
    website,
    rekening
  } = donasi_detail;

  if (nama === "" || lokasi === "" || kontak === "" || website === "" || rekening === "") {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang diperlukan'
      });
  }

  if (req.file) {
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return res
        .status(404)
        .json({
          status: 'fail',
          message: 'Hanya dapat menggunakan file gambar (.png, .jpg atau .jpeg)'
        });
    }

    const newFilename = `${uuidv1()}-${req.file.originalname}`;
    const blob = bucket.file(newFilename);
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
      const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;

      donasi_detail.gambar = publicUrl;
      donasi = await donasi.update(donasi_detail);

      res.json(donasi);
    });

    blobStream.end(req.file.buffer);
  } else {
    donasi_detail.gambar = donasi.gambar;
    donasi = await donasi.update(donasi_detail);

    res.json(donasi);
  }
}

const deleteDonasi = async (req, res) => {
  const id = req.params.id;

  const donasi = await Donasi.findByPk(id);

  if (!donasi) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data donasi tidak ditemukan'
      });
  }

  await donasi.destroy();

  res
    .status(200)
    .json({
      status: 'success',
      message: 'Data donasi telah terhapus'
    });
}

module.exports = {
  getAllDonasi,
  getDonasiById,
  addDonasi,
  updateDonasi,
  deleteDonasi
};
