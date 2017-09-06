'use strict';

const jwt = require('jsonwebtoken');

const secret = think.config('session.secret');

export default class extends think.service.base {
    /**
     * init
     * @return {}         []
     */
    init(...args) {
        super.init(...args);
    }

    /**
     * 根据header中的X-Nideshop-Token值获取用户id
     */
    async getUserId() {

        const token = think.token;

        if (!token) {
            return 0;
        }

        let result = await this.parse();

        if (think.isEmpty(result) || result.user_id <= 0) {
            return 0;
        }

        return result.user_id;
    }

    /**
     * 根据值获取用户信息
     */
    async getUserInfo() {

        let userId = await this.getUserId();
        if (userId <= 0) {
            return null;
        }

        let userInfo = await this.model('admin').field(['id', 'username', 'avatar', 'admin_role_id']).where({id: userId}).find();

        return think.isEmpty(userInfo) ? null : userInfo;
    }

    async create(userInfo) {
        return jwt.sign(userInfo, secret);
    }

    async parse() {

        if (think.isEmpty(think.token)) {
            return null;
        }

        try {
            return jwt.verify(think.token, secret);
        } catch (err) {
            return null;
        }
    }

    async verify() {

        if (await this.parse()) {
            return false;
        }

        return true;
    }
}