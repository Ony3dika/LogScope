export default function parseLogs(logContent) {
  const logLines = logContent.split("\n").filter((line) => line.trim());
  const userStats = {};
  const ipData = {};
  const timeData = {};

  logLines.forEach((line) => {
    const timeMatch = line.match(/\[([\d\-: ]+)\]/);
    const isSuccess = line.includes("successfully logged in");
    const userMatch = line.match(/User (\w+)|user (\w+)/);
    const ipMatch = line.match(/(\d+\.\d+\.\d+\.\d+)/);

    if (userMatch && ipMatch && timeMatch) {
      const user = userMatch[1] || userMatch[2];
      const ip = ipMatch[1];
      const time = timeMatch[1];
      const hour = time.split(" ")[1].split(":")[0];
      const timeKey = `${hour}:00`;

      // Track user stats
      if (!userStats[user]) {
        userStats[user] = {
          user,
          successful: 0,
          failed: 0,
          ip: ip,
          lastLogin: time,
        };
      }

      if (isSuccess) {
        userStats[user].successful += 1;
        userStats[user].ip = ip;
        userStats[user].lastLogin = time;
      } else {
        userStats[user].failed += 1;
      }

      // Track IP stats
      if (!ipData[ip]) {
        ipData[ip] = {
          ip,
          accessCount: 0,
          users: new Set(),
        };
      }
      ipData[ip].accessCount += 1;
      ipData[ip].users.add(user);

      // Track time stats
      if (!timeData[timeKey]) {
        timeData[timeKey] = {
          time: timeKey,
          successful: 0,
          failed: 0,
        };
      }
      if (isSuccess) {
        timeData[timeKey].successful += 1;
      } else {
        timeData[timeKey].failed += 1;
      }
    }
  });

  return {
    userStats: Object.values(userStats),
    ipStats: Object.values(ipData).map((ip) => ({
      ...ip,
      users: Array.from(ip.users).join(", "),
    })),
    timeStats: Object.values(timeData).sort((a, b) =>
      a.time.localeCompare(b.time)
    ),
  };
}
