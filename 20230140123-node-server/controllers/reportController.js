const presensiRecords = require("../data/presensiData");
const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;
    let options = { where: {} };

    // Filter by nama if provided
    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    // Filter by date range if provided
    if (tanggalMulai && tanggalSelesai) {
      options.where.checkIn = {
        [Op.between]: [
          new Date(tanggalMulai + "T00:00:00Z"),
          new Date(tanggalSelesai + "T23:59:59Z"),
        ],
      };
    }

    const records = await Presensi.findAll({
      ...options,
      order: [["checkIn", "DESC"]], // Sort by checkIn date descending
    });

    res.json({
      reportDate: new Date().toLocaleDateString(),
      filterCriteria: {
        nama: nama || "all",
        periode: tanggalMulai && tanggalSelesai ? `${tanggalMulai} s/d ${tanggalSelesai}` : "all",
      },
      totalRecords: records.length,
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};