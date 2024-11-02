class BaseModel {
     constructor() {
          if (new.target === BaseModel) {
               throw new Error("Cannot instantiate an abstract class.");
          }
     }

     async init() {
          throw new Error("Method 'init' must be implemented.");
     }

     async store(data) {
          throw new Error("Method 'store' must be implemented.");
     }

     async getAll() {
          throw new Error("Method 'getAll' must be implemented.");
     }

     async getById(id) {
          throw new Error("Method 'getById' must be implemented.");
     }

     async delete(id) {
          throw new Error("Method 'delete' must be implemented.");
     }
}

export default BaseModel;