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
        middlewares: [
            authenticateJwtToken(['admin',  ${config?.saveCreatorUsers ? `'user',` : ``} ${mdl?.permissions?.post ? mdl?.permissions?.post?.map(item => `"${item}"`): ''}]),
           ${Object.keys(mdl.model)?.
            filter(itm => (mdl.model[itm] == "file" || mdl.model[itm] == "File" || mdl.model[itm].type == "file" || mdl.model[itm].type == "File")).
            length !== 0 ? `       upload('${mdl.name}').fields([${Object.keys(mdl.model)?.filter(itm => (mdl.model[itm] == "file" || mdl.model[itm] == "File" || mdl.model[itm].type == "file" || mdl.model[itm].type == "File")).map(item => `{name: '${item}', maxCount: 1}`)}]),` : ''} 
        ],
        controller: async (req, res, next) => {
            try{
                let ${mdl.name} = new ${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}({${Object.keys(mdl.model)?.filter(itm => (mdl.model[itm] != "file" & mdl.model[itm] != "File" & mdl.model[itm].type != "file" & mdl.model[itm].type != "File"))?.map(item => `\n                      ${item}: req.body.${item}`)}${Object.keys(mdl.model)?.filter(itm => (mdl.model[itm] == "file" || mdl.model[itm] == "File" || mdl.model[itm].type == "file" || mdl.model[itm].type == "File"))?.map((item, idx) => `${idx == 0 ? ',' : ''}\n                      ${item}: generateFileName(req.files.${item}[0], '${mdl.name}')`)},${typeof config.baseModel == 'object' ? Object.keys(config.baseModel)?.map(item => config.baseModel[item]?.hasOwnProperty('default') ? 
                `\n                      ${item}: ${typeof config.baseModel[item]?.default == 'string' ? config.baseModel[item]?.default : `req.body.${item}`}`
                :
                `\n                      ${item}: req.body.${item}`) : ''}
                ${config?.saveCreatorUsers ? `,\n           related_user: req.user.userId` : ``}
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
                res.status(500).send({message: error})
                next()
            }
        }
    },
    getList: {
        middlewares: [
            authenticateJwtToken(['admin', ${mdl?.permissions?.getList ? mdl?.permissions?.getList?.map(item => `"${item}"`): ''}]),
        ],
        controller: async (req, res, next) => {
            try{
                res.send(await baseResults(${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}, 'list', req.query, true, [${
                    Object.keys(mdl.model)?.filter(item => moduleNames?.includes(mdl.model[item]) || moduleNames?.includes(mdl.model[item]?.type)).map(item => `'${item}'`)      
                }]))
            }catch (error){
                if(process.env.NODE_ENV !== 'production'){
                    console.log(error)
                }
                res.status(500).send({message: error})
                next()
            }
        }
    },
    getDetail: {
        middlewares: [
            authenticateJwtToken(['admin', ${mdl?.permissions?.getDetail ? mdl?.permissions?.getDetail?.map(item => `"${item}"`) : ''}]),
        ],
        controller: async (req, res, next) => {
            try{
                let id = req.params.id;
                const ${mdl.name}  = await ${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}.findById(id)
                if(${mdl.name}){
                    ${
                        mdl?.permissions?.getDetail?.includes('self') ? 
                        `if(req.user.role == 'admin' || req.user.userId == ${mdl.name}.related_user._id){
                            return res.send(await baseResults(${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}, 'id', req.params, false, [${
                                Object.keys(mdl.model)?.filter(item => moduleNames?.includes(mdl.model[item]) || moduleNames?.includes(mdl.model[item]?.type)).map(item => `'${item}'`)      
                            }]))
                           }else{
                            res.status(403).send('Sorry, you dont have access to this part')
                           }`:
                           `
                          
                            return res.send(await baseResults(${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}, 'id', req.params, false, [${
                                Object.keys(mdl.model)?.filter(item => moduleNames?.includes(mdl.model[item]) || moduleNames?.includes(mdl.model[item]?.type)).map(item => `'${item}'`)      
                            }]))
                          
                           `
                    }
                }else{
                    res.status(404).send({message: "There is no ${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} with this id"})
                }
            }catch (error){
                if(process.env.NODE_ENV !== 'production'){
                    console.log(error)
                }
                res.status(500).send({message: error})
                next()
            }
        }
    },
    put: {
        middlewares: [
            authenticateJwtToken(['admin', ${mdl?.permissions?.put ? mdl?.permissions?.put?.map(item => `"${item}"`) : ''}]),
           ${Object.keys(mdl.model)?.filter(itm => (mdl.model[itm] == "file" || mdl.model[itm] == "File" || mdl.model[itm].type == "file" || mdl.model[itm].type == "File")).length !== 0 ? `       upload('${mdl.name}').fields([${Object.keys(mdl.model)?.filter(itm => (mdl.model[itm] == "file" || mdl.model[itm] == "File" || mdl.model[itm].type == "file" || mdl.model[itm].type == "File")).map(item => `{name: '${item}', maxCount: 1}`)}]),` : ''} 
        ],
        controller: async (req, res, next) => {
            try{
                let id = req.params.id;
                const ${mdl.name}  = await ${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}.findById(id)
                if(${mdl.name}){
                  ${
                    mdl?.permissions?.put?.includes('self') ? 
                    `
                    if(req.user.role == "admin" || req.user.userId == ${mdl.name}.related_user._id){
                        ${
                            Object.keys(mdl.model)?.filter(itm => (mdl.model[itm] == "file" || mdl.model[itm] == "File" || mdl.model[itm].type == "file" || mdl.model[itm].type == "File"))?.map(
                                item => `\n                    ${mdl.name}.${item} = req.files.${item}[0] ? generateFileName(req.files.${item}[0], '${mdl.name}') : ${mdl.name}.${item}`
                            ).join('')
                        }
                        
                        let keys = Object.keys(req.body); 
                        keys.map(item => ${mdl.name}[item] = req.body[item])
                        const updated${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} = await ${mdl.name}.save();
                        if(updated${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} ){
                            return res.send({result: updated${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} })
                        }else{
                           return res.status(500).send({message: 'Error in updating ${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}'})
                        }
                    }else{
                        res.status(403).send('Sorry, you dont have access to this part')
                    } 
                    ` :
                    `
                    ${
                        Object.keys(mdl.model)?.filter(itm => (mdl.model[itm] == "file" || mdl.model[itm] == "File" || mdl.model[itm].type == "file" || mdl.model[itm].type == "File"))?.map(
                            item => `\n                    ${mdl.name}.${item} = req.files.${item}[0] ? generateFileName(req.files.${item}[0], '${mdl.name}') : ${mdl.name}.${item}`
                        ).join('')
                    }
                    
                    let keys = Object.keys(req.body); 
                    keys.map(item => ${mdl.name}[item] = req.body[item])
                    const updated${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} = await ${mdl.name}.save();
                    if(updated${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} ){
                        return res.send({result: updated${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} })
                    }else{
                       return res.status(500).send({message: 'Error in updating ${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}'})
                    }`
                  }
                }else{
                   return res.status(404).send({message: 'There is no ${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} with this id'})
                }
            }catch (error){
                if(process.env.NODE_ENV !== 'production'){
                    console.log(error)
                }
                res.status(500).send({message: error})
                next()
            }
        }
    },
    delete: {
        middlewares: [
            authenticateJwtToken(['admin', ${mdl?.permissions?.delete ? mdl?.permissions?.delete?.map(item => `"${item}"`) : ''}]),
        ],
        controller: async (req, res, next) => {
            try{
                const ${mdl.name} = await ${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}.findById(req.params.id);
                if (${mdl.name}) {
                    ${
                        mdl?.permissions?.delete?.includes('self') ? 
                        `
                        if(req.user.role == "admin" || req.user.userId == ${mdl.name}.related_user._id){
                            await ${mdl.name}.deleteOne({_id: req.params.id});
                     
                            res.send({ message: "${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} Deleted" });
                        }else{
                            res.status(403).send('Sorry, you dont have access to this part')
                        } 
                        ` : 
                        `  await ${mdl.name}.deleteOne({_id: req.params.id});
                        res.send({ message: "${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} Deleted" });`
                    }
                } else {
                  res.status(404).send({ message: "${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)} Not Found" });
                }
            }catch (error){
                if(process.env.NODE_ENV !== 'production'){
                    console.log(error)
                }
                res.status(500).send({message: error})
                next()
            }
        }
    }
};

module.exports = ${mdl.name}Controller;

`

        await  mkdirp.mkdirpSync(`backend/src/controllers/${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}/`)
        fs.writeFileSync(`backend/src/controllers/${mdl.name.charAt(0).toUpperCase() + mdl.name.slice(1)}/index.js`, template)
        console.log(`🟥 Selph - ${mdl.name} controller generated...`)
    })

  } catch (error) {
    throw error;
  }
};

module.exports = cg;
