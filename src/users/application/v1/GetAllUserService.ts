import { IUserRepository } from "../../domain/repositories";

interface IRequest {
  page?: number;
  perPage?: number;
  term?: string;
  role?: string;
  dateFrom?: string;
  dateTo?: string;
}
export class GetAllUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(queryData: IRequest): Promise<any> {
    const { data, metadata } = await this.userRepository.findAll(queryData);
    // let dataResponse = [];
    // for (const user of data) {
    //   const groupOfficeDelegated =
    //     await this.officeGroupsRepository.findOneUserIdToReturn(user?.id);
    //   dataResponse.push({
    //     ...user,
    //     isOfficeDelegated: Boolean(groupOfficeDelegated),
    //   });
    // }

    return {
      message: "Successful",
      code: "000000",
      data: {
        data: data,
        metadata,
      },
    };
  }
}
