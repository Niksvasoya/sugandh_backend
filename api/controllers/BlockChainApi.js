let BlockChain = require("./BlockChain");
const BlockChainApi = () => {
  const addBlock = async (req, res) => {
    try {
      console.log("check");
      let BlockChain = require("./BlockChain");

      console.log("test");
      let blockChain = new BlockChain();
      let data = req.body;
      blockChain.addNewBlock(null, data);
      console.log("chain", blockChain);
      return res.status(200).json({
        code: 2000,
        success: true,
        message: `success.`,
      });
    } catch (error) {
      return res.status(501).json(error.error);
    }
  };
  const updateBlock = async (req, res) => {
    try {
      console.log("check");
      let BlockChain = require("./BlockChain");
      console.log("test");
      let blockChain = new BlockChain();
      let id = req.params.id;
      console.log(req.params.id, id);
      let data = req.body;
      blockChain.update(id, data, (blocks) => {
        console.log(blocks);
        return res.status(200).json({
          code: 2000,
          success: true,
          message: `success.`,
          // data: blocks
        });
      });
    } catch (error) {
      return res.status(501).json(error.error);
    }
  };
  const get = async (req, res) => {
    try {
      console.log("check");
      let BlockChain = require("./BlockChain");
      console.log("test");
      let blockChain = new BlockChain();
      blockChain.getAll((blocks) => {
        if (blocks) {
          console.log(blocks);
          return res.status(200).json({
            code: 2000,
            success: true,
            message: `success.`,
            data: blocks,
          });
        }
      });
    } catch (error) {
      return res.status(500).json(error.error);
    }
  };
  const getById = async (req, res) => {
    try {
      console.log("check");
      let BlockChain = require("./BlockChain");
      console.log("test");
      let blockChain = new BlockChain();
      let id = req.params.id;
      console.log(id);
      blockChain.getBlock(id, (block) => {
        console.log(block);
        return res.status(200).json({
          code: 2000,
          success: true,
          message: `success.`,
          data: block,
        });
      });

      // console.log("dataaaa", data)

      // })
      // console.log(blockChainModel)
      // blockChainModel.find({}, (error, result) => {
      //   if (error) {
      //     console.log("eroor")
      //     return res.status(501).send(error);
      //   }
      //   return res.status(200).json({
      //             code: 2000,
      //             success: true,
      //             message: `success.`,
      //             data:result
      //           });
      // });
    } catch (error) {
      return res.status(500).json(error.error);
    }
  };

  return {
    addBlock,
    get,
    getById,
    updateBlock,
  };
};
module.exports = BlockChainApi;
