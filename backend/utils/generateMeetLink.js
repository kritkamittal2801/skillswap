const generateMeetLink = () => {

  const room =
    Math.random()
      .toString(36)
      .substring(2, 10);

  return (
    `https://meet.jit.si/${room}`
  );
};

export default generateMeetLink;