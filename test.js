const cg = require('./index')

let config = {
    saveCreatorUsers: true,
    "modules": [
        {
            "name": "test",
            "model": {
                "title": "String",
                "link": {"type": "String"},
                "stepNumber": {"type": "Number", "default": 0, "unique": true}
            }
        },
        {
            "name": "asd",
            "model": {
                "name": "String",
                "testId": {"type": "test"},
                "testIasdd": 'test',
                "birth_date": {"type": "Date", "unique": true, "default": "new Date()"},
                "file1": "file",
                "file2": "File",
                "file3": {type: "file"},
                "file4": {type: "File"},
                "user": "user"
            },
            "permissions": {
                "getList": ["user", "self"],
                "getDetail": ["user"],
                "post": [],
                "delete": ["self"],
                "put": ["self"]
            }
        }
    ],
    "baseModel": {
        "isActive": {"type": "Boolean", "default": true},
        "created_date": {"type": "Date", "default": "new Date()"},
        "test": {"type": "test"}
    }
}

let main = async (cn) => {
    try {
        await cg(cn)
    } catch (error) {
        throw error
    }
}

main(config)