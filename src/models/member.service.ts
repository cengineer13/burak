import { HttpCode, Message } from "../libs/errors";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import Errors from "../libs/errors";
import { MemberType } from "../libs/enums/member.enum";

class MemberService {
    private readonly memberModel; //DB ni ozgartirmaslik uchun 
    constructor() {
        this.memberModel = MemberModel;
    }
    public async processSignup(input: MemberInput): Promise<Member> {
        const exist = await this.memberModel.findOne({ memberType: MemberType.RESTAURANT })
            .exec();
        console.log("exist", exist)
        if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
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
        
        // agar input pw bn DB member pw bir xil bo'lmasa Error qilamiz va uni controler catchga uzatamiz
        const isMatch = input.memberPassword === member.memberPassword;
        if (!isMatch) throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);

        return await this.memberModel.findById(member._id).exec();
    }

};

export default MemberService;