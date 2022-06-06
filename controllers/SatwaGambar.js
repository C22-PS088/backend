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

const { Satwa, Satwa_gambar } = require('../models');

const v = new Validator();

const getAllSatwaGambar = async (req, res) => {
  const satwa_gambar = await Satwa_gambar.findAll({
    include: [{
      model: Satwa
    }]
  });
  res.json(satwa_gambar);
}

const getSatwaGambarById = async (req, res) => {
  const id = req.params.id;

  const satwa_gambar = await Satwa_gambar.findOne({
    where: {
      id: id
    },
    include: [{
      model: Satwa
    }]
  });

  if (!satwa_gambar) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data gambar satwa tidak ditemukan'
      });
  }

  res.json(satwa_gambar);
}

const getSatwaGambarBySatwa = async (req, res) => {
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

  const satwa_gambar = await Satwa_gambar.findAll({
    where: {
      SatwaId: id
    },
    include: [{
      model: Satwa
    }]
  });

  res.json(satwa_gambar);
}

const addSatwaGambar = async (req, res) => {
  const schema = {
    SatwaId: 'number|integer|optional'
  }

  const satwa_gambar_detail = JSON.parse(req.body.data);

  const validate = v.validate(satwa_gambar_detail, schema);

  if (validate.length) {
    return res
      .status(400)
      .json(validate);
  }

  const {
    SatwaId
  } = satwa_gambar_detail;

  if (SatwaId === "") {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang diperlukan'
      });
  }

  const satwa = await Satwa.findByPk(SatwaId);

  if (!satwa) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data satwa tidak ditemukan'
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
      console.log(error);
    });

    blobStream.on('finish', async () => {
      console.log('success');
    });

    blobStream.end(req.file.buffer);

    satwa_gambar_detail.gambar = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;
    const satwa_gambar = await Satwa_gambar.create(satwa_gambar_detail);

    res.json(satwa_gambar);
  } else {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: 'Mohon mengisi semua kolom yang diperlukan'
      });
  }
}

const deleteSatwaGambar = async (req, res) => {
  const id = req.params.id;

  const satwa_gambar = await Satwa_gambar.findByPk(id);

  if (!satwa_gambar) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data gambar satwa tidak ditemukan'
      });
  }

  if (satwa_gambar.gambar) {
    const gambar_old = satwa_gambar.gambar.replaceAll(`https://storage.googleapis.com/${process.env.GCS_BUCKET}/`, '');

    try {
      await bucket.file(gambar_old).delete();
    } catch (error) {
      console.log(error);
    }
  }

  await satwa_gambar.destroy();

  res
    .status(200)
    .json({
      status: 'success',
      message: 'Data gambar satwa telah terhapus'
    });
}

module.exports = {
  getAllSatwaGambar,
  getSatwaGambarById,
  getSatwaGambarBySatwa,
  addSatwaGambar,
  deleteSatwaGambar
};
