export const formatResponse = (data: any, message: string) => ({
  success: true,
  message,
  data
});



export const success = (data: any, message = "Success") => ({
  status: "success",
  message,
  data,
});

export const fail = (message = "Error", error: any = null) => ({
  status: "fail",
  message,
  error,
});
