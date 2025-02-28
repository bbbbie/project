// Components/UserDataForm.ts
import { LoginRequest, UserParams } from "../../apiMongoDB/dto/User";

export type UserFormData = UserParams & {
    confirmPassword?: string;
};

export type LoginFormData = LoginRequest;