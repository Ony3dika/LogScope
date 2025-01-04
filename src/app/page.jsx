"use client";
import { useState } from "react";


export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null)

  //Submit the file and parse the log data
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const loginData = parseLogs(e.target.result);
      console.log(loginData);
      setResult(loginData.userStats)
    };
    reader.readAsText(file);
  };

  //Tabluating the log data
  const parseLogs = (logContent) => {
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
  };
  // Prepare data for Chart.js

  return (
    <main className='h-screen bg-[#000000] p-5 text-[#f4f4f5]'>
      <div className='flex md:flex-row flex-col items-center justify-between h-[95vh]'>
        <section className='basis-[30%] h-[95vh] bg-gradient-to-br from-[#2b2a2a] via-[#262629]  p-5 rounded-2xl border-2 border-[#252429]'>
          <h1 className='text-4xl font-bold text-[#44b66e]'>LogScope</h1>{" "}
          <p className='my-4'>Analyze and Track trails of Users in an Organization</p>
          <form onSubmit={handleSubmit}>
            <input
              type='file'
              onChange={(event) => {
                setFile(event.target.files[0]);
              }}
              className='mb-5'
            />
            <br />
            <button
              type='submit'
              className='bg-[#404046]/80 backdrop-blur-2xl border-2 border-[#2a2a2d] transition-all duration-300 ease-linear font-bold py-2 px-6 rounded-3xl'
            >
              Upload
            </button>
          </form>
        </section>

        {/* Main Content */}
        <section className='md:basis-[68%] basis-full w-full md:mt-0 mt-5 h-[95vh] overflow-y-scroll bg-[#17161a] p-5 rounded-2xl border-2 border-[#252429]'>
          {/* Log Data Table */}
          {result && (
            <div>
              <h2 className='text-2xl font-bold mb-4'>User LogIn Data</h2>
              <table border='1' bordercolor='#f4f4f5' className='w-full'>
                <thead className='bg-[#2b2a2a]'>
                  <tr>
                    <th className='w-1/5 p-2 border border-[#252429]'>User</th>
                    <th className='w-1/5 p-2 border border-[#252429]'>
                      IP Address
                    </th>
                    <th className='w-1/5 p-2 border border-[#252429]'>
                      Success
                    </th>

                    <th className='w-1/5 p-2 border border-[#252429]'>
                      Failed
                    </th>
                    <th className='w-1/5 p-2 border border-[#252429]'>
                      Timestamp
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {result.map((user, index) => (
                    <tr key={index} className='hover:bg-[#2b2a2a]'>
                      <td className='p-2 pl-5 border border-[#252429]'>
                        {user.user}
                      </td>
                      <td className='text-center p-2 border border-[#252429]'>
                        {user.ip}
                      </td>
                      <td className='text-center p-2 border border-[#252429]'>
                        {user.successful}
                      </td>
                      <td className='text-center p-2 border border-[#252429]'>
                        {user.failed}
                      </td>
                      <td className='text-center p-2 border border-[#252429]'>
                        {user.lastLogin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Log File Chart */}
          
        </section>
      </div>
    </main>
  );
}
