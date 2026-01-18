import { getAddress } from "thirdweb";
import z from "zod";

export const zAddress = z.string().transform(getAddress);
