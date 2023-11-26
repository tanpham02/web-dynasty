import { Button, Result } from 'antd';
import { PATH_NAME } from '~/constants/router';

const PageNotFound = () => {
  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={
        <Button
          type='primary'
          href={PATH_NAME.STAFF_MANAGEMENT}
          className='!bg-primary !text-white border border-solid !border-primary'
        >
          Back Home
        </Button>
      }
    />
  );
};

export default PageNotFound;
