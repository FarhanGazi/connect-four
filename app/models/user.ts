import crypto = require('crypto');
import { mongoose } from "../../config/db";

var Schema = mongoose.Schema;

export interface User extends Document {
    username: string,
    email: string,
    roles: string[],
    salt: string,
    digest: string,
    img: any,
    set_password: (password: string) => void,
    validate_password: (password: string) => boolean,
    is_admin: () => boolean,
    set_admin: () => void
}

const user_schema = new Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    roles: {
        type: [mongoose.SchemaTypes.String],
        required: true
    },
    salt: {
        type: mongoose.SchemaTypes.String,
        required: false
    },
    digest: {
        type: mongoose.SchemaTypes.String,
        required: false
    },
    img: {
        data: Buffer,
        contentType: String
    }
});

user_schema.methods = {
    set_password: function (password: string) {
        this.salt = crypto.randomBytes(16).toString('hex');
        var hmac = crypto.createHmac('sha512', this.salt);
        hmac.update(password);
        this.digest = hmac.digest('hex');
    },

    validate_password: function (password: string): boolean {
        var hmac = crypto.createHmac('sha512', this.salt);
        hmac.update(password);
        var digest = hmac.digest('hex');
        return (this.digest === digest);
    },

    is_admin: function (): boolean {
        for (var roleidx in this.roles) {
            if (this.roles[roleidx] === 'admin')
                return true;
        }
        return false;
    },

    set_admin: function () {
        if (!this.is_admin())
            this.roles.push("admin");
    }
}

var user_model;

export function get_schema() { return user_schema; }

export function get_model() {
    if (!user_model) {
        user_model = mongoose.model('User', get_schema())
    }
    return user_model;
}

export function new_user(data) {
    var _usermodel = get_model();
    var user = new _usermodel(data);

    return user;
}