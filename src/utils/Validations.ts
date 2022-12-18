function validateNewAuthor(name: string, email: string, phone: string) {
  const regName = /[a-zA-Z\u00C0-\u00FF ]+/i;
  /* const regPhone = new RegExp(
    '^\\([0-9]{2}\\)((3[0-9]{3}-[0-9]{4})|(9[0-9]{3}-[0-9]{5}))$'
  ); */
  const regPhone = /^[0-9]+$/;
  const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const result = { name: false, email: false, phone: false };

  if (regName.test(name)) result.name = true;
  if (regPhone.test(phone) && phone.length === 11) result.phone = true;
  if (regEmail.test(email)) result.email = true;

  return result;
}

export default validateNewAuthor;
