const bcrypt = require('bcryptjs');
const { userRepo } = require('../../lib/userRepo');
const { asyncHandler, badRequest, notFound, unauthorized } = require('../../lib/http');

const get = asyncHandler(async (req, res) => {
  const repo = userRepo(req.user.role);
  const user = await repo.getById(req.user.id);
  if (!user) throw notFound();
  res.json({ user });
});

const update = asyncHandler(async (req, res) => {
  const repo = userRepo(req.user.role);
  const user = await repo.update(req.user.id, req.body);
  res.json({ user });
});

const changePassword = asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!new_password || new_password.length < 8) throw badRequest('new_password must be at least 8 characters');

  const repo = userRepo(req.user.role);
  const record = await repo.getByEmail((await repo.getById(req.user.id)).email);
  if (!record) throw notFound();
  if (record.password_hash) {
    if (!current_password) throw badRequest('current_password is required');
    const ok = await bcrypt.compare(current_password, record.password_hash);
    if (!ok) throw unauthorized('Current password is incorrect');
  }
  const hash = await bcrypt.hash(new_password, 10);
  await repo.setPassword(req.user.id, hash);
  res.json({ updated: true });
});

module.exports = { get, update, changePassword };
