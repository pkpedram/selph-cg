const {mkdirp} = require('mkdirp')
const fs = require('fs-extra')

const cg = async (config = Object) => {
  try {
    let moduleNames = config.modules.map(item => item.name)
    config.modules.map(async mdl => {
        

        let template = 
`const { authenticateJwtToken } = require("../../core/middlewares/jwt");
const { upload } = require("../../core/middlewares/multer");
const { baseResults } = require("../../core/utils/Results");
const { generateFileName } = require("../../core/utils/multer");
${
 `\nconst ${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} = require("../../models/${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}");`

}

const ${mdl.name}Controller = {
    post: {
        middlewares: [],
        controller: async (req, res, next) => {
            try{
                let ${mdl.name} = new ${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}({${Object.keys(mdl.model)?.map(item => `\n                      ${item}: req.body.${item}`)},${typeof config.baseModel == 'object' ? Object.keys(config.baseModel)?.map(item => config.baseModel[item]?.hasOwnProperty('default') ? 
                `\n                      ${item}: ${typeof config.baseModel[item]?.default == 'string' ? config.baseModel[item]?.default : `req.body.${item}`}`
                :
                `\n                      ${item}: req.body.${item}`) : ''}
                })
                await ${mdl.name}.save()
                if(process.env.NODE_ENV !== 'production'){
                    console.log(${mdl.name})
                }
                return res.send({result: ${mdl.name}})
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
                res.send(await baseResults(${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}, 'list', req.query, true, [${
                    Object.keys(mdl.model)?.filter(item => moduleNames?.includes(mdl.model[item]) || moduleNames?.includes(mdl.model[item]?.type)).map(item => `'${item}'`)      
                }]))
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
                return res.send(await baseResults(${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}, 'id', req.params, false, [${
                    Object.keys(mdl.model)?.filter(item => moduleNames?.includes(mdl.model[item]) || moduleNames?.includes(mdl.model[item]?.type)).map(item => `'${item}'`)      
                }]))
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
                const ${mdl.name}  = await ${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}.findById(id)
                if(${mdl.name}){
                    let keys = Object.keys(req.body); 
                    keys.map(item => ${mdl.name}[item] = req.body[item])
                    const updated${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} = await ${mdl.name}.save();
                    if(updated${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} ){
                        return res.send({result: updated${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} })
                    }else{
                       return res.status(500).send({message: 'Error in updating ${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}'})
                    }
                }else{
                   return res.status(404).send({message: 'There is no ${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} with this id'})
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
                const ${mdl.name} = await ${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}.findById(req.params.id);
                if (${mdl.name}) {
                  await ${mdl.name}.remove();
                  res.send({ message: "${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} Deleted" });
                } else {
                  res.status(404).send({ message: "${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} Not Found" });
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

module.exports = ${mdl.name}Controller;

`

        await  mkdirp.mkdirpSync(`backend/src/controllers/${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}/`)
        fs.writeFileSync(`backend/src/controllers/${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}/index.js`, template)
    })

  } catch (error) {
    throw error;
  }
};

module.exports = cg;
