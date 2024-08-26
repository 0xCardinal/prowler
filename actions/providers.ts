"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseStringify } from "@/lib";

export const getProvider = async ({ page = 1 }) => {
  if (isNaN(Number(page)) || page < 1) redirect("/providers");

  const keyServer = process.env.LOCAL_SERVER_URL;

  try {
    const providers = await fetch(
      `${keyServer}/providers?page%5Bnumber%5D=${page}`,
      {
        headers: {
          "X-Tenant-ID": `${process.env.HEADER_TENANT_ID}`,
        },
      },
    );
    const data = await providers.json();
    const parsedData = parseStringify(data);
    revalidatePath("/providers");
    return parsedData;
  } catch (error) {
    console.error("Error fetching providers:", error);
    return undefined;
  }
};
export const addProvider = async (formData: FormData) => {
  const keyServer = process.env.LOCAL_SERVER_URL;

  const provider = formData.get("provider");
  const providerId = formData.get("id");
  const alias = formData.get("alias");

  try {
    const response = await fetch(`${keyServer}/providers`, {
      method: "POST",
      headers: {
        "X-Tenant-ID": `${process.env.HEADER_TENANT_ID}`,
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "Provider",
          attributes: {
            provider: provider,
            provider_id: providerId,
            alias: alias,
          },
        },
      }),
    });
    const data = await response.json();
    revalidatePath("/providers");
    return parseStringify(data);
  } catch (error) {
    console.error(error);
    return {
      error: getErrorMessage(error),
    };
  }
  revalidatePath("/providers");
};
export const checkConnectionProvider = async (formData: FormData) => {
  const keyServer = process.env.LOCAL_SERVER_URL;

  const providerId = formData.get("id");

  try {
    const response = await fetch(
      `${keyServer}/providers/${providerId}/connection`,
      {
        method: "POST",
        headers: {
          "X-Tenant-ID": `${process.env.HEADER_TENANT_ID}`,
        },
      },
    );
    const data = await response.json();
    revalidatePath("/providers");
    return parseStringify(data);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const deleteProvider = async (formData: FormData) => {
  const keyServer = process.env.LOCAL_SERVER_URL;

  const providerId = formData.get("id");

  try {
    const response = await fetch(`${keyServer}/providers/${providerId}`, {
      method: "DELETE",
      headers: {
        "X-Tenant-ID": `${process.env.HEADER_TENANT_ID}`,
      },
    });
    const data = await response.json();
    revalidatePath("/providers");
    return parseStringify(data);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Oops! Something went wrong.";
  }
  return message;
};
