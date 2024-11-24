import crypto from 'crypto';

function hashName(name) {
  return crypto.createHash('md5').update(name).digest('hex').substring(0, 8);
}

const invitees = [
  { slug: hashName('Nguyễn Thị Hạnh'), name: 'Nguyễn Thị Hạnh' },
  { slug: hashName('Trần Thanh Bình'), name: 'Trần Thanh Bình' },
  { slug: hashName('Lê Văn Minh'), name: 'Lê Văn Minh' },
  { slug: hashName('Phạm Thị Lan'), name: 'Phạm Thị Lan' },
  { slug: hashName('Hoàng Văn Nam'), name: 'Hoàng Văn Nam' },
];

export default invitees;