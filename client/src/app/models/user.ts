export class User{

    constructor(

        public _id: string,
        public name: string,
        public lastName: string,
        public birthDate : string,
        public phoneNumber : string,
        public profileImage : string,
        public email : string,
        public password: string
    ){}
}