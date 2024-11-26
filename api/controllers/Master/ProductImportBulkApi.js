const Product = require("../../models/Product/Product");
const Sequelize = require('sequelize');
const xlsx = require('xlsx');
const Category = require("../../models/Product/Category");
const SubCategory = require("../../models/Product/SubCategory");
const Collection = require("../../models/Product/Collection");
const Brand = require("../../models/Product/Brand");
const Fabric = require("../../models/Product/Fabric");
const FabricCare = require("../../models/Product/FabricCare");
const Occasion = require("../../models/Product/Occasion");
const NeckType = require("../../models/Product/NeckType");
const SleeveType = require("../../models/Product/SleeveType");
const TaxType = require("../../models/Accounting/TaxType");
const HsnCode = require("../../models/Product/HsnCode");
const Color = require("../../models/Product/Color");
const ProductVariants = require("../../models/Product/ProductVariants");
const Size = require("../../models/Product/Size");
const Coupon = require("../../models/Coupon/Coupon");




// For combining sheets data
const ProductImportBulkApi = () => {
    const importData = async (req, res) => {
        try {
            const allowedFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            // Check if a file is included in the request
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ message: 'No files were uploaded.' });
            }
            // Access the Excel file content from the uploaded file
            const file = req.files.file;
            // Check if the file type is allowed (Excel file)
            if (!allowedFileTypes.includes(file.mimetype)) {
                return res.status(400).json({ message: 'Invalid file type. Please upload an Excel file.' });
            }
            const buffer = file.data;
            // Parse the Excel file
            const workbook = xlsx.read(buffer, { type: 'buffer' });
            // Assuming both workbooks have the same structure, you can merge the sheets
            const sheetName1 = workbook.SheetNames[0];
            const sheet1 = workbook.Sheets[sheetName1];
            const sheetName2 = workbook.SheetNames[1];
            const sheet2 = workbook.Sheets[sheetName2];
            // Convert Excel data to an array of objects
            const dataProduct = xlsx.utils.sheet_to_json(sheet1);
            const dataProductVariant = xlsx.utils.sheet_to_json(sheet2);

            // Import Product Data
            await importProductData(dataProduct, res);
            // Import ProductVariant data
            await importProductVariantData(dataProductVariant, res);
            return res.status(200).json({
                code: 200,
                success: true,
                message: `Data imported successfully.`,
                data: [],
            });

        } catch (error) {
            console.error("Error while inserting : ", error);
            return res.status(422).json({ message: 'Internal Server Error.' });
        }
    };
    const syncAndInsertData = async (Model, fieldName, data, res) => {
        // Sync the model with the database (create the table if not exists)
        await Model.sync();

        // Iterate through the data and find IDs for the specified model
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (fieldName == 'hsn_code_id') {
                // Find the model without creating it
                const model = await Model.findOne({
                    where: {
                        code: JSON.stringify(row[fieldName])
                    }
                });
                // If the model exists, update name to ID
                if (model) {
                    row[fieldName] = model.dataValues.id;
                } else {
                    return res.status(422).json({ message: 'Please complete the related table first' });
                }
            } else if (fieldName.endsWith('_id')) {
                // Find the model without creating it
                const model = await Model.findOne({
                    where: {
                        name: {
                            // Case-insensitive search
                            [Sequelize.Op.iLike]: row[fieldName],
                        }
                    }
                });
                if (model) {
                    row[fieldName] = model.dataValues.id;
                } else {
                    return res.status(422).json({ message: 'Please complete the related table first' });
                }
            }
        }
    };


    const importProductData = async (data, res) => {
        // List of models and their corresponding field names to sync and insert
        const modelsToSync = [
            { model: Category, fieldName: 'category_id' },
            { model: SubCategory, fieldName: 'sub_category_id' },
            { model: Collection, fieldName: 'collection_id' },
            { model: Brand, fieldName: 'brand_id' },
            { model: HsnCode, fieldName: 'hsn_code_id' },
            { model: Fabric, fieldName: 'fabric_id' },
            { model: FabricCare, fieldName: 'fabric_care_id' },
            { model: Occasion, fieldName: 'occasion_id' },
            { model: NeckType, fieldName: 'neck_type_id' },
            { model: SleeveType, fieldName: 'sleeve_type_id' },
            { model: TaxType, fieldName: 'tax_type_id' },
            // Add more models as needed
        ];

        // Call the function for each model
        for (const { model, fieldName } of modelsToSync) {
            await syncAndInsertData(model, fieldName, data, res);
        }

        // Map the data 
        const modifiedData = data.map(row => ({ ...row }));

        // Filter out records where the name already exists in the Product model

        let filteredData = [];
        for (let prod = 0; prod < modifiedData.length; prod++) {
            let dataInternal = await Product.findOne({
                where: {
                    name: {
                        // Case-insensitive search
                        [Sequelize.Op.iLike]: modifiedData[prod].name,
                    }
                }
            })
            if (!dataInternal) {
                filteredData.push(modifiedData[prod])
            }
        }
        const createPromises = filteredData.map(row => Product.create(row));
        await Promise.all(createPromises);
        // await Product.bulkCreate(filteredData);

    };
    const importProductVariantData = async (data, res) => {
        // List of models and their corresponding field names to sync and insert
        const modelsToSync = [
            { model: Product, fieldName: 'product_id' },
            { model: Color, fieldName: 'color_id' },
            { model: Size, fieldName: 'size_id' },
            { model: Coupon, fieldName: 'coupon_id' },
            // Add more models as needed
        ];

        // Call the function for each model
        for (const { model, fieldName } of modelsToSync) {
            await syncAndInsertData(model, fieldName, data, res);
        }

        // Use Promise.all with create
        const createPromises = data.map(row => ProductVariants.create(row));
        await Promise.all(createPromises);
        // await ProductVariants.bulkCreate(data);
    };

    return {
        importData
    };
};
module.exports = ProductImportBulkApi;