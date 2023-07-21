const { authenticateJwtToken } = require("../../core/middlewares/jwt");
const { upload } = require("../../core/middlewares/multer");
const { baseResults } = require("../../core/utils/Results");
const { generateFileName } = require("../../core/utils/multer");

const Asd = require("../../models/Asd");

const asdController = {
    post: {
        middlewares: [],
        controller: async (req, res, next) => {
            try{
                let asd = new Asd({
                      name: req.body.name,
                      testId: req.body.testId,
                      testIasdd: req.body.testIasdd,
                      birth_date: req.body.birth_date,
                      isActive: req.body.isActive,
                      created_date: new Date(),
                      test: req.body.test
                })
                await asd.save()
                if(process.env.NODE_ENV !== 'production'){
                    console.log(asd)
                }
                return res.send({result: asd})
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
                res.send(await baseResults(Asd, 'list', req.query, true, ['testId','testIasdd']))
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
                return res.send(await baseResults(Asd, 'id', req.params, false, ['testId','testIasdd']))
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
                const asd  = await Asd.findById(id)
                if(asd){
                    let keys = Object.keys(req.body); 
                    keys.map(item => asd[item] = req.body[item])
                    const updatedAsd = await asd.save();
                    if(updatedAsd ){
                        return res.send({result: updatedAsd })
                    }else{
                       return res.status(500).send({message: 'Error in updating Asd'})
                    }
                }else{
                   return res.status(404).send({message: 'There is no Asd with this id'})
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
                const asd = await Asd.findById(req.params.id);
                if (asd) {
                  await asd.remove();
                  res.send({ message: "Asd Deleted" });
                } else {
                  res.status(404).send({ message: "Asd Not Found" });
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

module.exports = asdController;

