const Validator = require('fastest-validator');
const uuid = require('uuid');
const midtransClient = require('midtrans-client');

// Create Core API instance
let coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

const uuidv1 = uuid.v1;

const { Transaksi, Donasi } = require('../models');

const v = new Validator();

const getTransaksi = async (req, res) => {
  const transaksi = await Transaksi.findAll({
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: Donasi
    }]
  });

  const mapped_transaksi = transaksi.map((transaksi) => {
    const transaction_time = new Date(JSON.parse(transaksi.midtrans_response).transaction_time);
    const transaction_expired = new Date(transaction_time.getTime() + 60 * 60 * 24 * 1000);

    return {
      id: transaksi.id,
      donasi: transaksi.Donasi.nama,
      email: transaksi.email,
      gross_amount: JSON.parse(transaksi.midtrans_response).gross_amount,
      transaction_time: transaction_time.toLocaleString('en-US'),
      transaction_expired: transaction_expired.toLocaleString('en-US'),
      transaction_status: JSON.parse(transaksi.midtrans_response).transaction_status,
      bank: JSON.parse(transaksi.midtrans_response).va_numbers[0].bank,
      va_number: JSON.parse(transaksi.midtrans_response).va_numbers[0].va_number
    };
  });

  res.json(mapped_transaksi);
}

const getTransaksiByEmail = async (req, res) => {
  const email = req.params.email;

  const transaksi = await Transaksi.findAll({
    where: {
      email: email
    },
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: Donasi
    }]
  });

  const mapped_transaksi = transaksi.map((transaksi) => {
    const transaction_time = new Date(JSON.parse(transaksi.midtrans_response).transaction_time);
    const transaction_expired = new Date(transaction_time.getTime() + 60 * 60 * 24 * 1000);

    return {
      id: transaksi.id,
      donasi: transaksi.Donasi.nama,
      email: transaksi.email,
      gross_amount: JSON.parse(transaksi.midtrans_response).gross_amount,
      transaction_time: transaction_time.toLocaleString('en-US'),
      transaction_expired: transaction_expired.toLocaleString('en-US'),
      transaction_status: JSON.parse(transaksi.midtrans_response).transaction_status,
      bank: JSON.parse(transaksi.midtrans_response).va_numbers[0].bank,
      va_number: JSON.parse(transaksi.midtrans_response).va_numbers[0].va_number
    };
  });

  res.json(mapped_transaksi);
}

const getTransaksiStatus = async (req, res) => {
  try {
    const id = req.params.id;

    let transaksi = await Transaksi.findOne({
      where: {
        id: id
      },
      include: [{
        model: Donasi
      }]
    });

    if (!transaksi) {
      return res
        .status(404)
        .json({
          status: 'fail',
          message: 'Data transaksi tidak ditemukan'
        });
    }

    const statusResponse = await coreApi.transaction.status(id);

    const midtrans_response = JSON.stringify(statusResponse);

    transaksi = await transaksi.update({
      midtrans_response: midtrans_response
    });

    const transaction_time = new Date(JSON.parse(transaksi.midtrans_response).transaction_time);
    const transaction_expired = new Date(transaction_time.getTime() + 60 * 60 * 24 * 1000);

    const mapped_transaksi = {
      id: transaksi.id,
      donasi: transaksi.Donasi.nama,
      email: transaksi.email,
      gross_amount: JSON.parse(transaksi.midtrans_response).gross_amount,
      transaction_time: transaction_time.toLocaleString('en-US'),
      transaction_expired: transaction_expired.toLocaleString('en-US'),
      transaction_status: JSON.parse(transaksi.midtrans_response).transaction_status,
      bank: JSON.parse(transaksi.midtrans_response).va_numbers[0].bank,
      va_number: JSON.parse(transaksi.midtrans_response).va_numbers[0].va_number
    };

    res.json(mapped_transaksi);
  } catch (error) {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: error.message
      });
  }
}

const addTransaksi = async (req, res) => {
  try {
    const {
      id,
      bank,
      email,
      nominal
    } = req.body;

    const formatted_request = {
      id: parseInt(id),
      bank: bank,
      email: email,
      nominal: parseInt(nominal)
    }

    const schema = {
      id: 'number|integer|positive',
      bank: 'string',
      email: 'email',
      nominal: 'number|integer|positive',
    }

    const validate = v.validate(formatted_request, schema);

    if (validate.length) {
      return res
        .status(400)
        .json(validate);
    }

    const donasi = await Donasi.findByPk(id);

    if (!donasi) {
      return res
        .status(404)
        .json({
          status: 'fail',
          message: 'Data donasi tidak ditemukan'
        });
    }

    if (id === "" || bank === "" || email === "" || nominal === "") {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Mohon mengisi semua kolom yang diperlukan'
        });
    }

    if (bank !== "bri" && bank !== "bni" && bank !== "bca") {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Pilihan bank salah'
        });
    }

    const order_id = uuidv1();

    const params = {
      payment_type: "bank_transfer",
      bank_transfer: {
        bank: bank
      },
      transaction_details: {
        order_id: order_id,
        gross_amount: nominal
      }
    };

    const chargeResponse = await coreApi.charge(params);

    let transaksi_detail = {
      id: chargeResponse.order_id,
      DonasiId: id,
      email: email,
      midtrans_response: JSON.stringify(chargeResponse)
    }

    const transaksi = await Transaksi.create(transaksi_detail);
    const transaction_time = new Date(JSON.parse(transaksi.midtrans_response).transaction_time);
    const transaction_expired = new Date(transaction_time.getTime() + 60 * 60 * 24 * 1000);

    const mapped_transaksi = {
      id: transaksi.id,
      donasi: donasi.nama,
      email: transaksi.email,
      gross_amount: JSON.parse(transaksi.midtrans_response).gross_amount,
      transaction_time: transaction_time.toLocaleString('en-US'),
      transaction_expired: transaction_expired.toLocaleString('en-US'),
      transaction_status: JSON.parse(transaksi.midtrans_response).transaction_status,
      bank: JSON.parse(transaksi.midtrans_response).va_numbers[0].bank,
      va_number: JSON.parse(transaksi.midtrans_response).va_numbers[0].va_number
    };

    res.json(mapped_transaksi);
  } catch (error) {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: error.message
      });
  }
}

const notifHandler = async (req, res) => {
  try {
    const statusResponse = await coreApi.transaction.notification(req.body);

    const id = statusResponse.order_id;
    const midtrans_response = JSON.stringify(statusResponse);

    const transaksi = await Transaksi.update({
      midtrans_response: midtrans_response
    }, {
      where: {
        id: id
      }
    });

    res.json(transaksi);
  } catch (error) {
    return res
      .status(400)
      .json({
        status: 'fail',
        message: error.message
      });
  }
}

module.exports = {
  getTransaksi,
  getTransaksiByEmail,
  getTransaksiStatus,
  addTransaksi,
  notifHandler
};
