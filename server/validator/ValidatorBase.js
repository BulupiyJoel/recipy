class ValidatorBase {
     constructor() {
          this.fields = {}; // Initialize an empty object to store fields
     }

     isEmptyOnAll(fields) {
          const emptyFields = [];
          for (const name in fields) {
               if (!fields[name]) { // Check for falsy values (empty string, null, undefined)
                    emptyFields.push(name);
               }
          }
          return emptyFields;
     }

     isEmpty(field) {
          return !field.name; // Return true if field.name is falsy, false otherwise
     }
}

export default ValidatorBase;