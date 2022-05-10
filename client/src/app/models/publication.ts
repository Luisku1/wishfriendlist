export class Publication{

    constructor(

        public _id: string,
        public namePublication: string,
        public text: string,
        public createdAt: string,
        public file: string,
        public user: any

    ){}
}