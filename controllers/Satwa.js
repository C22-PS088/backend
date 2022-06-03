const Validator = require('fastest-validator');

const { Satwa, Satwa_gambar } = require('../models');

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

const addSatwa = async (req, res) => {
  const schema = {
    nama: 'string',
    nama_saintifik: 'string|optional',
    lokasi: 'string|optional',
    populasi: 'string|optional',
    funfact: 'string|optional',
  }

  const validate = v.validate(req.body, schema);

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

  const satwa = await Satwa.create(req.body);

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

  const schema = {
    nama: 'string|optional',
    nama_saintifik: 'string|optional',
    lokasi: 'string|optional',
    populasi: 'string|optional',
    funfact: 'string|optional',
  }

  const validate = v.validate(req.body, schema);

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

  satwa = await satwa.update(req.body);

  res.json(satwa);
}

const deleteSatwa = async (req, res) => {
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
  addSatwa,
  updateSatwa,
  deleteSatwa
};
