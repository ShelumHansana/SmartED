# Register.jsx Name Attributes Update Guide

## Quick Fix for Form Inputs

Add `name` attribute to ALL form inputs matching their `id`:

### Student Form - Column 1:
- `id="fullName"` → add `name="fullName"`
- `id="email"` → add `name="email"` ✅ DONE
- `id="gender"` → add `name="gender"` ✅ DONE
- `id="indexNumber"` → add `name="indexNumber"` ✅ DONE
- `id="birthDay"` → add `name="birthDay"` ✅ DONE
- `id="birthMonth"` → add `name="birthMonth"` ✅ DONE
- `id="birthYear"` → add `name="birthYear"` ✅ DONE
- `id="guardianName"` → add `name="guardianName"`
- `id="password"` → add `name="password"`
- `id="confirmPassword"` → add `name="confirmPassword"`

### Student Form - Column 2:
- `id="grade"` → add `name="grade"`
- `id="stream"` → add `name="stream"`
- `id="class"` → add `name="class"`
- `id="admissionDate"` → add `name="admissionDate"`
- `id="address"` → add `name="address"`
- `id="contactNumber"` → add `name="contactNumber"`
- `id="guardianContact"` → add `name="guardianContact"`

### Teacher Form:
- `id="title"` → add `name="title"`
- `id="fullName"` → add `name="fullName"`
- `id="email"` → add `name="email"`
- `id="teacherIndex"` → add `name="teacherIndex"`
- `id="inChargeType"` → add `name="inChargeType"`
- `id="inChargeDetails"` → add `name="inChargeDetails"`
- `id="password"` → add `name="password"`
- `id="confirmPassword"` → add `name="confirmPassword"`

### Parent Form:
- `id="parentTitle"` → add `name="parentTitle"`
- `id="fullName"` → add `name="fullName"`
- `id="childName"` → add `name="childName"`
- `id="relationship"` → add `name="relationship"`
- `id="maritalStatus"` → add `name="maritalStatus"`
- `id="birthDay"` → add `name="birthDay"`
- `id="birthMonth"` → add `name="birthMonth"`
- `id="birthYear"` → add `name="birthYear"`
- `id="childIndex"` → add `name="childIndex"`
- `id="telephone"` → add `name="telephone"`
- `id="mobile"` → add `name="mobile"`
- `id="password"` → add `name="password"`
- `id="confirmPassword"` → add `name="confirmPassword"`

## Note
The Register.jsx component is now functional with Firebase integration!
The handleSubmit function will collect all form data using FormData API.
Just ensure all inputs have matching name attributes for data collection.
