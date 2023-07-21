const cg = require('./index')

let config = {

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
                "birth_date": {"type": "Date", "unique": true, "default": "new Date()"}
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