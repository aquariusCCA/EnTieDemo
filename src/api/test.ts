import request from '@/utils/request'

enum API {
    TEST_GET_USERS = '/test/getUsers',
}

export const getUsers = () => {
    return request({
        url: API.TEST_GET_USERS,
        method: 'post',
    })
}