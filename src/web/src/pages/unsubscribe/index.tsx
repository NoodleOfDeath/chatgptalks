import React from 'react';

import { SubscriptionEvent } from '~/api';
import Layout from '~/components/Layout';
import { StorageContext } from '~/contexts';
import { useRouter } from '~/hooks';

export default function UnsubcribePage() {

  const { api: { unsubscribe } } = React.useContext(StorageContext);
  const { searchParams } = useRouter();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [message, setMessage] = React.useState('');

  const validateToken = React.useCallback(async () => {
    try {
      const token = searchParams.get('t');
      if (!token) {
        setMessage('Error, no token provided.');
        setLoading(false);
        return;
      }
      const { error } = await unsubscribe({ event: SubscriptionEvent.Default, unsubscribeToken: token });
      if (error) {
        throw error;
      }
      setMessage('Success! You have been unsubscribed. You will no longer receive emails from us. Sad face');
    } catch (e) {
      setMessage('Error, invalid token.');
    } finally {
      setLoading(false);
    }
  }, [searchParams, unsubscribe]);

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  return (
    <Layout>
      <div>
        {loading && <div>Unsubscribing...</div>}
        {!loading && <div>{message}</div>}
      </div>
    </Layout>
  );
}