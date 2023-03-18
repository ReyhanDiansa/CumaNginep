import useSWR from 'swr';
import { useRouter } from 'next/router';
import Link from 'next/link';

const fetcher = url => fetch(url).then(res => res.json());

const UserDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(`http://localhost:8000/user/findOne/${id}`, fetcher);

  if (error) return <div>Failed to load user data.</div>;
  if (!data) return <div>Loading...</div>;

  const { nama_user, email, role } = data.data;

  return (
    <div>
      <h1>{nama_user}</h1>
      <p>Email: {email}</p>
      <p>Role: {role}</p>
      <br />
      <Link href={`/user/UpdateUser/${id}`}>Update</Link>
    </div>
  );
};

export default UserDetails;
