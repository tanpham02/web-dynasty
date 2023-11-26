import { Button, Col, Modal, Row, Typography } from 'antd';
import { Membership } from '~/models/membership';
import MembershipModalInfoTableCustomer from './MembershipModalInfoTableCustomer';

interface MembershipCreateModalProps {
  onClose: () => void;
  membershipById?: Membership;
}

export const MembershipModalInfo = ({ onClose, membershipById }: MembershipCreateModalProps) => {
  return (
    <Modal
      open={true}
      onCancel={onClose}
      title={'Chi tiết hạng thành viên'}
      style={{ minWidth: '50%' }}
      footer={[
        <Button
          style={{ border: '1px solid #1890ff', color: '#1890ff' }}
          onClick={onClose}
        >
          Tắt
        </Button>,
      ]}
    >
      <Row>
        <Col span={8}>
          <Typography.Text
            type='secondary'
            className='!text-black flex justify-center items-center text-[15px] font-medium'
          >
            Hình ảnh hạng thành viên
          </Typography.Text>
          <div className=' cursor-pointer p-5 mt-2 mx-auto '>
            <img
              className='mx-auto my-0 max-w-full rounded-lg'
              src={membershipById?.backgroundImage}
              alt={membershipById?.name}
            />
          </div>
        </Col>

        <Col span={16}>
          <Typography.Text
            type='secondary'
            className='!text-black text-[15px] font-medium'
          >
            Thông tin chung
          </Typography.Text>
          <Row
            gutter={16}
            className='mt-5'
          >
            <Col span={24}>
              <Typography.Text
                type='secondary'
                className='!text-black '
              >
                Tên hạng thành viên:&nbsp;
              </Typography.Text>
              <Typography.Text
                type='secondary'
                className='text-[15px] font-medium '
                style={{ color: membershipById?.color || '#000000' }}
              >
                {membershipById?.name || ''}
              </Typography.Text>
            </Col>
          </Row>

          <Row
            gutter={16}
            className='mt-5'
          >
            <Col span={24}>
              <Typography.Text
                type='secondary'
                className='!text-black '
              >
                Giá trị tích lũy cần đạt ( bằng số ):&nbsp;
              </Typography.Text>
              <Typography.Text
                type='secondary'
                className='!text-black text-[15px] font-medium tracking-[1px]'
              >
                {membershipById?.conditionPrice
                  ? `${Number(membershipById?.conditionPrice).toLocaleString('EN')}đ`
                  : ''}
              </Typography.Text>
            </Col>
          </Row>

          <Row
            gutter={16}
            className='mt-5'
          >
            <Col span={24}>
              <Typography.Text
                type='secondary'
                className='!text-black '
              >
                Giá trị tích lũy cần đạt ( bằng chữ ):&nbsp;
              </Typography.Text>
              <Typography.Text
                type='secondary'
                className='!text-black text-[15px] font-medium'
              >
                {membershipById?.conditionLabel || ''}
              </Typography.Text>
            </Col>
          </Row>

          <Row
            gutter={16}
            className='mt-5'
          >
            <Col span={24}>
              <Typography.Text
                type='secondary'
                className='!text-black '
              >
                Phần % giảm giá:&nbsp;
              </Typography.Text>
              <Typography.Text
                type='secondary'
                className='!text-black text-[15px] font-medium tracking-[1px]'
              >
                {`${membershipById?.percentDiscount}%` || ''}
              </Typography.Text>
            </Col>
          </Row>
        </Col>
      </Row>
      <MembershipModalInfoTableCustomer customerDTOs={membershipById?.customerDTOs} />
    </Modal>
  );
};
