import clientPromise from '@/lib/mongodb';

const getDbInstance = async () => {
  const client = await clientPromise;
  return client.db();
}

export default getDbInstance;