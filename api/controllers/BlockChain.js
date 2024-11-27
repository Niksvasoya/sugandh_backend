let hash = require("object-hash");
let validator = require("../controllers/Validator");
console.log("hello");
let mongoose = require("mongoose");
console.log("hello2");

let blockChainModel = require("../models/MongoDb/BlockChain");
console.log("hello3");

import chalk from 'chalk';
const TARGET_HASH = hash(1560);
class BlockChain {
  constructor() {
    this.chain = [];
    // this.curr_transaction = [];
  }
  getLastBlock(callback) {
    return blockChainModel.findOne(
      {},
      null,
      { sort: { _id: -1 }, limit: 1 },
      (err, block) => {
        if (err) return console.error("can not find block");
        console.log(block);
        return callback(block);
      }
    );
  }
  addNewBlock(prevHash, data) {
    let block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),

      // transaction: this.curr_transaction,
      // hash: null,
      prevHash: prevHash,
      data: data,
    };
    console.log(validator.proofOfWork);
    if (validator.proofOfWork() == TARGET_HASH) {
      block.hash = hash(block);
      // let lastBlock = null;
      this.getLastBlock((lastblock) => {
        if (lastblock) {
          block.prevHash = lastblock.hash;
          block.index = lastblock.index + 1;
        }
        let newBlock = new blockChainModel(block);
        console.log(newBlock, "hellloooo");
        newBlock.save((err) => {
          if (err) {
            return console.log(chalk.red("error"));
          }
          console.log(chalk.green("block saved on DB"));
        });

        this.hash = hash(block);

        this.chain.push(block);
        // this.curr_transaction = [];
        return block;
      });
    }

    // else {
    //     console.log("errorr")
    // }
  }
  isEmpty() {
    return this.chain.length == 0;
  }

  lastBlock() {
    return this.chain.slice(-1)[0];
  }

  getAll(callback) {
    return blockChainModel.find({}, (err, block) => {
      if (err) return console.error("can not find block");
      console.log(block, "block");
      return callback(block);
    });
  }
  getBlock(id, callback) {
    console.log(id, "id");
    blockChainModel.findOne({ _id: id }, (err, block) => {
      if (err) {
        console.log(err, block);
      } else {
        console.log(block, "blllll");
        return callback(block);
      }
    });
  }
  update(id, data, callback) {
    console.log(id, "id");
    console.log(data, "dattaaa");
    blockChainModel.findOneAndUpdate(
      { _id: id },
      { $set: { data: data.data } },
      { returnDocument: "after" },
      (block) => {
        return callback(block);
      }
    );
  }
}

module.exports = BlockChain;
