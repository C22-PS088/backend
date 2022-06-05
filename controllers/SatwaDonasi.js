const Validator = require('fastest-validator');
const { Op } = require("sequelize");

const { Satwa, Donasi, Satwa_donasi } = require('../models');

const v = new Validator();

const getAllSatwaDonasi = async (req, res) => {
  const satwa_donasi = await Satwa_donasi.findAll({
    include: [{
      model: Satwa
    }, {
      model: Donasi
    }]
  });
  res.json(satwa_donasi);
}

const getSatwaDonasiById = async (req, res) => {
  const id = req.params.id;

  const satwa_donasi = await Satwa_donasi.findOne({
    where: {
      id: id
    },
    include: [{
      model: Satwa
    }, {
      model: Donasi
    }]
  });

  if (!satwa_donasi) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data donasi satwa tidak ditemukan'
      });
  }

  res.json(satwa_donasi);
}

const getSatwaDonasiBySatwa = async (req, res) => {
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

  const satwa_donasi = await Satwa_donasi.findAll({
    where: {
      SatwaId: id
    },
    include: [{
      model: Satwa
    }, {
      model: Donasi
    }]
  });

  res.json(satwa_donasi);
}

const getSatwaDonasiBySatwaV2 = async (req, res) => {
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

  const satwa_donasi = await Satwa_donasi.findAll({
    where: {
      SatwaId: id
    },
    attributes: [],
    include: [{
      model: Donasi
    }]
  });

  const donasi = satwa_donasi.map((satwa_donasi) => {
    return satwa_donasi.Donasi;
  });

  res.json(donasi);
}

const getSatwaDonasiByDonasi = async (req, res) => {
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

  const satwa_donasi = await Satwa_donasi.findAll({
    where: {
      DonasiId: id
    },
    include: [{
      model: Satwa
    }, {
      model: Donasi
    }]
  });

  res.json(satwa_donasi);
}

const addSatwaDonasi = async (req, res) => {
  const schema = {
    SatwaId: 'number|integer|optional',
    DonasiId: 'number|integer|optional'
  }

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res
      .status(400)
      .json(validate);
  }

  const {
    SatwaId,
    DonasiId
  } = req.body;

  if (SatwaId === "" || DonasiId === "") {
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

  const donasi = await Donasi.findByPk(DonasiId);

  if (!donasi) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data donasi tidak ditemukan'
      });
  }

  const cek_duplikat_satwa_donasi = await Satwa_donasi.findAndCountAll({
    where: {
      SatwaId: SatwaId,
      DonasiId: DonasiId
    }
  });

  if (cek_duplikat_satwa_donasi && cek_duplikat_satwa_donasi.count > 0) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data donasi satwa sudah ada'
      });
  }

  const satwa_donasi = await Satwa_donasi.create(req.body);

  res.json(satwa_donasi);
}

const updateSatwaDonasi = async (req, res) => {
  const id = req.params.id;

  let satwa_donasi = await Satwa_donasi.findByPk(id);

  if (!satwa_donasi) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data donasi satwa tidak ditemukan'
      });
  }

  const schema = {
    SatwaId: 'number|integer|optional',
    DonasiId: 'number|integer|optional'
  }

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res
      .status(400)
      .json(validate);
  }

  const {
    SatwaId,
    DonasiId
  } = req.body;

  if (SatwaId === "" || DonasiId === "") {
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

  const donasi = await Donasi.findByPk(DonasiId);

  if (!donasi) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data donasi tidak ditemukan'
      });
  }

  const cek_duplikat_satwa_donasi = await Satwa_donasi.findAndCountAll({
    where: {
      id: {
        [Op.ne]: id
      },
      SatwaId: SatwaId,
      DonasiId: DonasiId
    }
  });

  if (cek_duplikat_satwa_donasi && cek_duplikat_satwa_donasi.count > 0) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data donasi satwa sudah ada'
      });
  }

  satwa_donasi = await satwa_donasi.update(req.body);

  res.json(satwa_donasi);
}

const deleteSatwaDonasi = async (req, res) => {
  const id = req.params.id;

  const satwa_donasi = await Satwa_donasi.findByPk(id);

  if (!satwa_donasi) {
    return res
      .status(404)
      .json({
        status: 'fail',
        message: 'Data donasi satwa tidak ditemukan'
      });
  }

  await satwa_donasi.destroy();

  res
    .status(200)
    .json({
      status: 'success',
      message: 'Data donasi satwa telah terhapus'
    });
}

module.exports = {
  getAllSatwaDonasi,
  getSatwaDonasiById,
  getSatwaDonasiBySatwa,
  getSatwaDonasiBySatwaV2,
  getSatwaDonasiByDonasi,
  addSatwaDonasi,
  updateSatwaDonasi,
  deleteSatwaDonasi
};
