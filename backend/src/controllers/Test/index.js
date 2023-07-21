const { authenticateJwtToken } = require("../../core/middlewares/jwt");
const { upload } = require("../../core/middlewares/multer");
const { baseResults } = require("../../core/utils/Results");
const { generateFileName } = require("../../core/utils/multer");

const Test = require("../../models/Test");

const testController = {
    post: {
        middlewares: [],
        controller: async (req, res, next) => {
            try{
                let test = new Test({
                      title: req.body.title,
                      link: req.body.link,
                      stepNumber: req.body.stepNumber,
                      isActive: req.body.isActive,
                      created_date: new Date(),
                      test: req.body.test
                })
                await test.save()
                if(process.env.NODE_ENV !== 'production'){
                    console.log(test)
                }
                return res.send({result: test})
            }
            catch (error){
                if(process.env.NODE_ENV !== 'production'){
                    console.log(error)
                }
                res.send({message: error})
                next()
            }
        }
    },
    getList: {
        middlewares: [],
        controller: async (req, res, next) => {
            try{
                res.send(await baseResults(Test, 'list', req.query, true, []))
            }catch (error){
                if(process.env.NODE_ENV !== 'production'){
                    console.log(error)
                }
                res.send({message: error})
                next()
            }
        }
    },
    getDetail: {
        middlewares: [],
        controller: async (req, res, next) => {
            try{
                return res.send(await baseResults(Test, 'id', req.params, false, []))
            }catch (error){
                if(process.env.NODE_ENV !== 'production'){
                    console.log(error)
                }
                res.send({message: error})
                next()
            }
        }
    },
    put: {
        middlewares: [],
        controller: async (req, res, next) => {
            try{
                let id = req.params.id;
                const test  = await Test.findById(id)
                if(test){
                    let keys = Object.keys(req.body); 
                    keys.map(item => test[item] = req.body[item])
                    const updatedTest = await test.save();
                    if(updatedTest ){
                        return res.send({result: updatedTest })
                    }else{
                       return res.status(500).send({message: 'Error in updating Test'})
                    }
                }else{
                   return res.status(404).send({message: 'There is no Test with this id'})
                }
            }catch (error){
                if(process.env.NODE_ENV !== 'production'){
                    console.log(error)
                }
                res.send({message: error})
                next()
            }
        }
    },
    delete: {
        middlewares: [],
        controller: async (req, res, next) => {
            try{
                const test = await Test.findById(req.params.id);
                if (test) {
                  await test.remove();
                  res.send({ message: "Test Deleted" });
                } else {
                  res.status(404).send({ message: "Test Not Found" });
                }
            }catch (error){
                if(process.env.NODE_ENV !== 'production'){
                    console.log(error)
                }
                res.send({message: error})
                next()
            }
        }
    }
};

module.exports = testController;

