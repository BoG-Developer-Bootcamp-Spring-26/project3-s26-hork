import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { verifyToken } from "@server/jwt";
import { getUser } from "@server/mongodb/actions/user";
import connectDb from "@server/mongodb/connectDb";

export interface SessionUser {
  fullName: string;
  admin: boolean;
}

//call inside getServerSideProps to get auth user, ret redirect to / if token is missing or invalid
export async function getServerSideUser(
  context: GetServerSidePropsContext
): Promise<{ user: SessionUser } | GetServerSidePropsResult<any>> {
  const token = context.req.cookies?.token;

  if (!token) {
    return { redirect: { destination: "/", permanent: false } };
  }

  try {
    const payload = verifyToken(token);
    await connectDb();
    const user = await getUser(payload.userId);

    if (!user) {
      return { redirect: { destination: "/", permanent: false } };
    }

    return {
      user: {
        fullName: user.fullName,
        admin: user.admin ?? false,
      },
    };
  } catch {
    return { redirect: { destination: "/", permanent: false } };
  }
}
