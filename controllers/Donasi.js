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

const { Donasi, Satwa_donasi } = require('../models');

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
    lokasi: 'string|optional',
    kontak: 'string|optional',
    website: 'string|optional',
    rekening: 'string|optional'
  }

  const donasi_detail = JSON.parse(req.body.data);

  const validate = v.validate(donasi_detail, schema);

  if (validate.length) {
    return res
      .status(400)
      .json(validate);
  }

  const {
    nama
  } = donasi_detail;

  if (nama === "") {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang diperlukan'
      });
  }

  if (req.files.logo) {
    const ext_logo = path.extname(req.files.logo[0].originalname).toLowerCase();

    if (ext_logo !== '.png' && ext_logo !== '.jpg' && ext_logo !== '.jpeg') {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Hanya dapat menggunakan file gambar (.png, .jpg atau .jpeg)'
        });
    }

    const newFilename_logo = `${uuidv1()}-${req.files.logo[0].originalname}`;
    const blob_logo = bucket.file(newFilename_logo);
    const blobStream_logo = blob_logo.createWriteStream();

    blobStream_logo.on('error', (error) => {
      console.log(error);
    });

    blobStream_logo.on('finish', async () => {
      console.log('success');
    });

    blobStream_logo.end(req.files.logo[0].buffer);

    donasi_detail.logo = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob_logo.name}`;
  }

  if (req.files.gambar) {
    const ext_gambar = path.extname(req.files.gambar[0].originalname).toLowerCase();

    if (ext_gambar !== '.png' && ext_gambar !== '.jpg' && ext_gambar !== '.jpeg') {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Hanya dapat menggunakan file gambar (.png, .jpg atau .jpeg)'
        });
    }

    const newFilename_gambar = `${uuidv1()}-${req.files.gambar[0].originalname}`;
    const blob_gambar = bucket.file(newFilename_gambar);
    const blobStream_gambar = blob_gambar.createWriteStream();

    blobStream_gambar.on('error', (error) => {
      console.log(error);
    });

    blobStream_gambar.on('finish', async () => {
      console.log('success');
    });

    blobStream_gambar.end(req.files.gambar[0].buffer);

    donasi_detail.gambar = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob_gambar.name}`;
  }

  const donasi = await Donasi.create(donasi_detail);

  res.json(donasi);
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
    nama
  } = donasi_detail;

  if (nama === "") {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang diperlukan'
      });
  }

  if (req.files.logo) {
    const ext_logo = path.extname(req.files.logo[0].originalname).toLowerCase();

    if (ext_logo !== '.png' && ext_logo !== '.jpg' && ext_logo !== '.jpeg') {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Hanya dapat menggunakan file gambar (.png, .jpg atau .jpeg)'
        });
    }

    const newFilename_logo = `${uuidv1()}-${req.files.logo[0].originalname}`;
    const blob_logo = bucket.file(newFilename_logo);
    const blobStream_logo = blob_logo.createWriteStream();

    blobStream_logo.on('error', (error) => {
      console.log(error)
    });

    blobStream_logo.on('finish', async () => {
      console.log('success');
    });

    blobStream_logo.end(req.files.logo[0].buffer);

    if (donasi.logo) {
      const logo_old = donasi.logo.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

      try {
        await bucket.file(logo_old).delete();
      } catch (error) {
        console.log(error);
      }
    }

    donasi_detail.logo = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob_logo.name}`;
  } else {
    donasi_detail.logo = donasi.logo;
  }

  if (req.files.gambar) {
    const ext_gambar = path.extname(req.files.gambar[0].originalname).toLowerCase();

    if (ext_gambar !== '.png' && ext_gambar !== '.jpg' && ext_gambar !== '.jpeg') {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Hanya dapat menggunakan file gambar (.png, .jpg atau .jpeg)'
        });
    }

    const newFilename_gambar = `${uuidv1()}-${req.files.gambar[0].originalname}`;
    const blob_gambar = bucket.file(newFilename_gambar);
    const blobStream_gambar = blob_gambar.createWriteStream();

    blobStream_gambar.on('error', (error) => {
      console.log(error);
    });

    blobStream_gambar.on('finish', async () => {
      console.log('success');
    });

    blobStream_gambar.end(req.files.gambar[0].buffer);

    if (donasi.gambar) {
      const gambar_old = donasi.gambar.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

      try {
        await bucket.file(gambar_old).delete();
      } catch (error) {
        console.log(error);
      }
    }

    donasi_detail.gambar = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob_gambar.name}`;
  } else {
    donasi_detail.gambar = donasi.gambar;
  }

  donasi = await donasi.update(donasi_detail);

  res.json(donasi);
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

  await Satwa_donasi.destroy({
    where: {
      DonasiId: donasi.id
    }
  });

  if (donasi.logo) {
    const logo_old = donasi.logo.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

    try {
      await bucket.file(logo_old).delete();
    } catch (error) {
      console.log(error);
    }
  }

  if (donasi.gambar) {
    const gambar_old = donasi.gambar.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

    try {
      await bucket.file(gambar_old).delete();
    } catch (error) {
      console.log(error);
    }
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
