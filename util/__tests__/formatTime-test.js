import formatTime from '../formatTime';

describe('formatTime', () => {
  it('adds AM in the morning', () => {
    expect(formatTime('1:02:00')).toEqual('1:02 AM');
  });

  it('adds PM in the evening', () => {
    expect(formatTime('15:01:00')).toEqual('3:01 PM');
  });

  it('returns midnight for midnight', () => {
    expect(formatTime('00:00:00')).toEqual('Midnight');
  });
});
