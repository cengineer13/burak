import { HttpCode, Message } from "../libs/errors";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import Errors from "../libs/errors";
import { MemberType } from "../libs/enums/member.enum";
import * as bcrypt from "bcryptjs";

class MemberService {
    private readonly memberModel; //DB ni ozgartirmaslik uchun 
    constructor() {
        this.memberModel = MemberModel;
    }

    // Restaurant user royxatdan otish
    public async processSignup(input: MemberInput): Promise<Member> {
        const exist = await this.memberModel.findOne({ memberType: MemberType.RESTAURANT })
            .exec();
        // console.log("exist", exist)
        if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

        // bcrypt orqali passwordni hashlash 
        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
        // console.log("after", input.memberPassword);

        try {
            const result = await this.memberModel.create(input);
            result.memberPassword = "";
            return result;
        } catch (err) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async processLogin(input:LoginInput): Promise <Member> {
        // member hosil qilib Schme modeldan DB ichidan qidiramiz
        const member = await this.memberModel
        .findOne(
            {memberNick:input.memberNick}, 
            {memberNick:1, memberPassword:1})
            .exec();
        
        // agar member DB da mavjud bo'lmasa Error qilamiz va uni controler catchga uzatamiz
        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
        
         // agar input pw bn DB dagi hashlanga pw bir xilligni tekshirish
        const isMatch = await bcrypt.compare(
            input.memberPassword,
            member.memberPassword);
        
        // xavfli usul -> const isMatch = input.memberPassword === member.memberPassword;
        // bir xil bo'lmasa Error qilamiz va uni controler catchga uzatamiz
        if (!isMatch) throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        console.log("Tizimga muvaffaqiyatli login bo'lindi!")
        return await this.memberModel.findById(member._id).exec();
    }

};

export default MemberService;