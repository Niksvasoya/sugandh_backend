const Sequelize = require("sequelize");

const sequelize = require("../../../config/database");

const hooks = {};

const tableName = "master_countries";

const Country = sequelize.define(
  "Country",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      // unique: {
      //   args: true,
      //   msg: 'Country name is already exist.',
      //   fields: [sequelize.fn('lower', sequelize.col('name'))]
      // }
      // validate: {
      //   notEmpty: {
      //     msg: "Name cannot be empty",
      //   },
      //   async isUnique(value) {
      //     let whereClause = {};
      //     whereClause.is_deleted = false;
      //     if (value) {
      //       whereClause.name = { [Sequelize.Op.iLike]: value };
      //     }
      //     if (this.id) {
      //       whereClause.id = { [Sequelize.Op.ne]: this.id };
      //     }
      //     const existingUser = await Country.findOne({
      //       where: whereClause,
      //     });
      //     if (existingUser) {
      //       throw new Error("Name is already exist");
      //     }
      //   },
      //   is: {
      //     args: /^[a-zA-Z\s-]+$/i,
      //     msg: "Name must contain only alphabets, spaces, and hyphens",
      //   },
      //   len: {
      //     args: [2, 10],
      //     msg: "Name must be between 2 and 10 characters long",
      //   },
      // },
    },
    iso3: {
      type: Sequelize.STRING,
      // validate: {
      //   len: {
      //     arg: [3, 3], // ensure that iso3 is exactly 3 characters long
      //     msg: "ISO 3 exactly 3 characters long",
      //   },
      //   isAlpha: {
      //     arg: true, // ensure that iso3 contains only alphabetic characters
      //     msg: "ISO 3 contains only alphabets",
      //   },
      // },
    },
    iso2: {
      type: Sequelize.STRING,
      // validate: {
      //   len: {
      //     arg: [2, 2], // ensure that iso3 is exactly 3 characters long
      //     msg: "ISO 2 exactly 2 characters long",
      //   },
      //   isAlpha: {
      //     arg: true, // ensure that iso3 contains only alphabetic characters
      //     msg: "ISO 2 contains only alphabets",
      //   },
      // },
    },
    numeric_code: {
      type: Sequelize.INTEGER,
      // validate: {
      //   isNumeric: {
      //     msg: "Numeric code must contain only numeric characters",
      //   },
      //   len: {
      //     args: [2, 3],
      //     msg: "Numeric code must be between 2 and 3 digits",
      //   },
      // },
    },
    phone_code: {
      type: Sequelize.INTEGER,
      validate: {
        isNumeric: {
          msg: "Phone code must contain only numeric characters",
        },
        len: {
          args: [1, 4],
          msg: "Phone code must be between 1 and 4 digits",
        },
      },
    },
    capital: {
      type: Sequelize.STRING,
      validate: {
        is: {
          args: /^[A-Za-z ]+$/i,
          msg: "Capital must contain only alphabets and spaces",
        },
      },
    },
    currency: {
      type: Sequelize.STRING,
      validate: {
        is: {
          args: /^[A-Z]{3}$/i,
          msg: "Currency code must be a 3-letter code in uppercase",
        },
      },
    },
    currency_name: {
      type: Sequelize.STRING,
    },
    currency_symbol: {
      type: Sequelize.STRING,
    },
    translations: {
      type: Sequelize.JSON,
    },
    tld: {
      type: Sequelize.STRING,
    },
    native: {
      type: Sequelize.STRING,
    },
    region: {
      type: Sequelize.STRING,
    },
    subregion: {
      type: Sequelize.STRING,
    },
    latitude: {
      type: Sequelize.DECIMAL,
    },
    longitude: {
      type: Sequelize.DECIMAL,
    },
    emoji: {
      type: Sequelize.STRING,
    },
    emojiU: {
      type: Sequelize.STRING,
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
  },
  { hooks, tableName }
);

module.exports = Country;
