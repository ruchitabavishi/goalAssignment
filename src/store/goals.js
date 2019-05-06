import Repository from '../services/apiHelper'

const res = '/goals'
export default{
    getGoals(){
        return Repository.get(`${res}`)
    },
    postGoal(){
        return Repository.post(`${res}`)
    },
    deleteGoal(){
        return Repository.delete(`${res}`)
    }
}