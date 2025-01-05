"use client";
import { useState } from "react";
import parseLogs from "@/app/components/parseLog";
import { IoCloseCircle } from "react-icons/io5";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [userDetails, setUserDetails] = useState("");
  const [popUp, setPopUp] = useState(false);

  //Submit the file and parse the log data
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    const reader = new FileReader();

    // Parse Function
    reader.onload = (e) => {
      const loginData = parseLogs(e.target.result);
      console.log(loginData);
      setResult(loginData.userStats);
    };
    reader.readAsText(file);
  };

  //Chart Data
  const data = {
    labels: ["Success", "Failed"],
    datasets: [
      {
        label: "Login Attempts",
        data: [userDetails.successful, userDetails.failed],
        backgroundColor: ["#44b66e", "#ff6384"],
        borderColor: ["#44b66e", "#ff4069"],
        borderWidth: 2,
      },
    ],
    hoverOffset: 4,
  };

  const options = {
    responsive: true,
  };

  return (
    <main className='h-screen bg-[#000000] p-5 text-[#f4f4f5]'>
      <div className='flex md:flex-row flex-col items-center justify-between h-[95vh]'>
        {/* Side Content */}
        <section className='basis-[30%] h-[95vh] bg-gradient-to-br from-[#2b2a2a] via-[#262629]  p-5 rounded-2xl border-2 border-[#252429]'>
          <h1 className='text-4xl font-bold text-[#44b66e]'>LogScope</h1>{" "}
          <p className='my-4'>
            Analyze and Track trails of Users in an Organization
          </p>
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
        <section className='md:basis-[68%] basis-full w-full md:mt-0 mt-5 h-[95vh] overflow-y-scroll bg-[#17161a]  rounded-2xl border-2 border-[#252429] relative'>
          {popUp && (
            <section className='sticky top-0 right-0 p-5 w-full h-full bg-[#17161a]/75 backdrop-blur rounded-2xl'>
              <div className='flex justify-between items-center'>
                <p className='md:text-3xl text-lg font-medium text-[#83868e]'>
                  User Details
                </p>
                <button onClick={() => setPopUp(false)}>
                  <IoCloseCircle className='text-[#5e5d68]' size={30} />
                </button>
              </div>

              <div className='md:mt-5 mt-3'>
                <p className='md:text-xl text-sm'>
                  <span className='text-[#83868e]'>User:</span>{" "}
                  {userDetails.user}
                </p>
                <p className='md:text-xl text-sm md:my-3 my-1'>
                  <span className='text-[#83868e]'>IP Address:</span>{" "}
                  {userDetails.ip}
                </p>
                <p className='md:text-xl text-sm'>
                  <span className='text-[#83868e]'>Last Login:</span>{" "}
                  {userDetails.lastLogin}
                </p>
              </div>
              <div className='flex h-2/3 w-full md:mt-10 mt-5 justify-center rounded-2xl'>
                <Doughnut data={data} options={options} />
              </div>
            </section>
          )}

          {/* Log Data Table */}
          {result && (
            <div className='md:p-5 p-3'>
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
                    <tr
                      key={index}
                      onClick={() => {
                        console.log(user);
                        setUserDetails(user);
                        setPopUp(true);
                      }}
                      className='hover:bg-[#2b2a2a] transition-all duration-500  ease-linear cursor-pointer'
                    >
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
