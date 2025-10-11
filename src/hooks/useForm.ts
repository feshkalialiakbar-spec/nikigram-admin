import { useState, useCallback } from "react";

export interface FormState {
  name: string;
  lastName: string;
  phoneNumber: string;
  phone: string;
  nationalCode: string;
  gender: string;
  date: string;
  education: string;
  nickname: string;
  bio: string;
  businessId: string;
  roleInCompany: string;
  description: string;
  specialty: string;
  skillLevel: string;
  workExperience: string;
  department: string;
  resumeFile: File | null;
  attachmentFile: File | null;
  cooperationType: string;
  requestTitle: string;
  projectType: string;
  timePeriod: string;
  requestAmount: string;
  requestDescription: string;
  code: string;
  refCode: string;
  companyName: string;
  companyRegCode: string;
  email: string;
  job: string;
  businessType: string;
  activityField: string;
  taxCode: string;
  province: string;
  city: string;
  address: string;
  clubInterested: boolean;
  productType: string;
  onlineOffline: string;
  serviceDescription: string;
  userType: string;
  economicCode: string;
  registrationCode: string;
  website: string;
  documents: {
    image: File | null;
    word: File | null;
    pdf: File | null;
  };
}

export interface FormErrors {
  name: string;
  lastName: string;
  phoneNumber: string;
  phone: string;
  nationalCode: string;
  gender: string;
  date: string;
  education: string;
  nickname: string;
  bio: string;
  businessId: string;
  roleInCompany: string;
  description: string;
  specialty: string;
  skillLevel: string;
  workExperience: string;
  department: string;
  resumeFile: string;
  attachmentFile: string;
  cooperationType: string;
  requestTitle: string;
  projectType: string;
  timePeriod: string;
  requestAmount: string;
  requestDescription: string;
  code: string;
  refCode: string;
  companyName: string;
  companyRegCode: string;
  email: string;
  job: string;
  businessType: string;
  activityField: string;
  taxCode: string;
  province: string;
  city: string;
  address: string;
  clubInterested: string;
  productType: string;
  onlineOffline: string;
  serviceDescription: string;
  userType: string;
  economicCode: string;
  registrationCode: string;
  website: string;
  documents: {
    image: string;
    word: string;
    pdf: string;
  };
}

export interface FormFocus {
  name: boolean;
  lastName: boolean;
  phoneNumber: boolean;
  nationalCode: boolean;
  gender: boolean;
  date: boolean;
  education: boolean;
  nickname: boolean;
  bio: boolean;
  businessId: boolean;
  roleInCompany: boolean;
  description: boolean;
  specialty: boolean;
  skillLevel: boolean;
  workExperience: boolean;
  department: boolean;
  resumeFile: boolean;
  attachmentFile: boolean;
  cooperationType: boolean;
  requestTitle: boolean;
  projectType: boolean;
  timePeriod: boolean;
  requestAmount: boolean;
  requestDescription: boolean;
  code: boolean;
  companyName: boolean;
  companyRegCode: boolean;
  email: boolean;
  job: boolean;
  businessType: boolean;
  activityField: boolean;
  taxCode: boolean;
  province: boolean;
  city: boolean;
  address: boolean;
  clubInterested: boolean;
  productType: boolean;
  onlineOffline: boolean;
  serviceDescription: boolean;
  economicCode: boolean;
  registrationCode: boolean;
  website: boolean;
  documents: {
    image: boolean;
    word: boolean;
    pdf: boolean;
  };
}

export interface FormEditing {
  name: boolean;
  lastName: boolean;
  phoneNumber: boolean;
  nationalCode: boolean;
  gender: boolean;
  date: boolean;
  education: boolean;
  nickname: boolean;
  bio: boolean;
  businessId: boolean;
  roleInCompany: boolean;
  description: boolean;
  specialty: boolean;
  skillLevel: boolean;
  workExperience: boolean;
  department: boolean;
  resumeFile: boolean;
  attachmentFile: boolean;
  cooperationType: boolean;
  requestTitle: boolean;
  projectType: boolean;
  timePeriod: boolean;
  requestAmount: boolean;
  requestDescription: boolean;
  code: boolean;
  companyName: boolean;
  companyRegCode: boolean;
  email: boolean;
  job: boolean;
  businessType: boolean;
  activityField: boolean;
  taxCode: boolean;
  province: boolean;
  city: boolean;
  address: boolean;
  clubInterested: boolean;
  productType: boolean;
  onlineOffline: boolean;
  serviceDescription: boolean;
  economicCode: boolean;
  registrationCode: boolean;
  website: boolean;
  documents: {
    image: boolean;
    word: boolean;
    pdf: boolean;
  };
}

export interface UseFormProps {
  initialValues?: Partial<FormState>;
}

export interface UseFormReturn {
  values: FormState;
  errors: FormErrors;
  focused: FormFocus;
  isEditing: FormEditing;
  handleChange: (field: keyof FormState, value: string | boolean | File | null) => void;
  handleDocumentChange: (documentType: 'image' | 'word' | 'pdf', file: File | null) => void;
  handleFocus: (field: keyof FormState) => void;
  handleDocumentFocus: (documentType: 'image' | 'word' | 'pdf') => void;
  handleBlur: <T extends keyof FormState>(
    field: T,
    validator?: (value: FormState[T]) => string
  ) => void;
  handleDocumentBlur: (documentType: 'image' | 'word' | 'pdf', validator?: (value: File | null) => string) => void;
  resetForm: () => void;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}

export function useForm({ initialValues = {} }: UseFormProps = {}): UseFormReturn {
  const [values, setValues] = useState<FormState>({
    name: "",
    lastName: "",
    phoneNumber: "",
    phone: "",
    nationalCode: "",
    gender: "",
    date: "",
    education: "",
    nickname: "",
    bio: "",
    businessId: "",
    roleInCompany: "",
    description: "",
    specialty: "",
    skillLevel: "",
    workExperience: "",
    department: "",
    resumeFile: null,
    attachmentFile: null,
    cooperationType: "",
    requestTitle: "",
    projectType: "",
    timePeriod: "",
    requestAmount: "",
    requestDescription: "",
    code: "",
    refCode: "",
    companyName: "",
    companyRegCode: "",
    email: "",
    job: "",
    businessType: "",
    activityField: "",
    taxCode: "",
    province: "",
    city: "",
    address: "",
    clubInterested: false,
    productType: "",
    onlineOffline: "",
    serviceDescription: "",
    userType: "",
    economicCode: "",
    registrationCode: "",
    website: "",
    documents: {
      image: null,
      word: null,
      pdf: null,
    },
    ...initialValues,
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    lastName: "",
    phoneNumber: "",
    phone: "",
    nationalCode: "",
    gender: "",
    date: "",
    education: "",
    nickname: "",
    bio: "",
    businessId: "",
    roleInCompany: "",
    description: "",
    specialty: "",
    skillLevel: "",
    workExperience: "",
    department: "",
    resumeFile: "",
    attachmentFile: "",
    cooperationType: "",
    requestTitle: "",
    projectType: "",
    timePeriod: "",
    requestAmount: "",
    requestDescription: "",
    code: "",
    refCode: "",
    companyName: "",
    companyRegCode: "",
    email: "",
    job: "",
    businessType: "",
    activityField: "",
    taxCode: "",
    province: "",
    city: "",
    address: "",
    clubInterested: "",
    productType: "",
    onlineOffline: "",
    serviceDescription: "",
    userType: "",
    economicCode: "",
    registrationCode: "",
    website: "",
    documents: {
      image: "",
      word: "",
      pdf: "",
    },
  });

  const [focused, setFocused] = useState<FormFocus>({
    name: false,
    lastName: false,
    phoneNumber: false,
    nationalCode: false,
    gender: false,
    date: false,
    education: false,
    nickname: false,
    bio: false,
    businessId: false,
    roleInCompany: false,
    description: false,
    specialty: false,
    skillLevel: false,
    workExperience: false,
    department: false,
    resumeFile: false,
    attachmentFile: false,
    cooperationType: false,
    requestTitle: false,
    projectType: false,
    timePeriod: false,
    requestAmount: false,
    requestDescription: false,
    code: false,
    companyName: false,
    companyRegCode: false,
    email: false,
    job: false,
    businessType: false,
    activityField: false,
    taxCode: false,
    province: false,
    city: false,
    address: false,
    clubInterested: false,
    productType: false,
    onlineOffline: false,
    serviceDescription: false,
    economicCode: false,
    registrationCode: false,
    website: false,
    documents: {
      image: false,
      word: false,
      pdf: false,
    },
  });

  const [isEditing, setIsEditing] = useState<FormEditing>({
    name: false,
    lastName: false,
    phoneNumber: false,
    nationalCode: false,
    gender: false,
    date: false,
    education: false,
    nickname: false,
    bio: false,
    businessId: false,
    roleInCompany: false,
    description: false,
    specialty: false,
    skillLevel: false,
    workExperience: false,
    department: false,
    resumeFile: false,
    attachmentFile: false,
    cooperationType: false,
    requestTitle: false,
    projectType: false,
    timePeriod: false,
    requestAmount: false,
    requestDescription: false,
    code: false,
    companyName: false,
    companyRegCode: false,
    email: false,
    job: false,
    businessType: false,
    activityField: false,
    taxCode: false,
    province: false,
    city: false,
    address: false,
    clubInterested: false,
    productType: false,
    onlineOffline: false,
    serviceDescription: false,
    economicCode: false,
    registrationCode: false,
    website: false,
    documents: {
      image: false,
      word: false,
      pdf: false,
    },
  });

  const handleChange = useCallback((field: keyof FormState, value: string | boolean | File | null) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleDocumentChange = (documentType: 'image' | 'word' | 'pdf', file: File | null) => {
    setValues((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file,
      },
    }));
  };

  const handleFocus = (field: keyof FormState) => {
    setFocused((prev) => ({ ...prev, [field]: true }));
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleDocumentFocus = (documentType: 'image' | 'word' | 'pdf') => {
    setFocused((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: true,
      },
    }));
    setIsEditing((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: true,
      },
    }));
  };

  const handleBlur = <T extends keyof FormState>(
    field: T,
    validator?: (value: FormState[T]) => string
  ) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
    if (validator) {
      const error = validator(values[field]);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleDocumentBlur = (documentType: 'image' | 'word' | 'pdf', validator?: (value: File | null) => string) => {
    setIsEditing((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: false,
      },
    }));
    if (validator) {
      const error = validator(values.documents[documentType]);
      setErrors((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [documentType]: error,
        },
      }));
    }
  };

  const resetForm = () => {
    setValues({
      name: "",
      lastName: "",
      phoneNumber: "",
      phone: "",
      nationalCode: "",
      gender: "",
      date: "",
      education: "",
      nickname: "",
      bio: "",
      businessId: "",
      roleInCompany: "",
      description: "",
      specialty: "",
      skillLevel: "",
      workExperience: "",
      department: "",
      resumeFile: null,
      attachmentFile: null,
      cooperationType: "",
      requestTitle: "",
      projectType: "",
      timePeriod: "",
      requestAmount: "",
      requestDescription: "",
      code: "",
      refCode: "",
      companyName: "",
      companyRegCode: "",
      email: "",
      job: "",
      businessType: "",
      activityField: "",
      taxCode: "",
      province: "",
      city: "",
      address: "",
      clubInterested: false,
      productType: "",
      onlineOffline: "",
      serviceDescription: "",
      userType: "",
      economicCode: "",
      registrationCode: "",
      website: "",
      documents: {
        image: null,
        word: null,
        pdf: null,
      },
      ...initialValues,
    });
    setErrors({
      name: "",
      lastName: "",
      phoneNumber: "",
      phone: "",
      nationalCode: "",
      gender: "",
      date: "",
      education: "",
      nickname: "",
      bio: "",
      businessId: "",
      roleInCompany: "",
      description: "",
      specialty: "",
      skillLevel: "",
      workExperience: "",
      department: "",
      resumeFile: "",
      attachmentFile: "",
      cooperationType: "",
      requestTitle: "",
      projectType: "",
      timePeriod: "",
      requestAmount: "",
      requestDescription: "",
      code: "",
      refCode: "",
      companyName: "",
      companyRegCode: "",
      email: "",
      job: "",
      businessType: "",
      activityField: "",
      taxCode: "",
      province: "",
      city: "",
      address: "",
      clubInterested: "",
      productType: "",
      onlineOffline: "",
      serviceDescription: "",
      userType: "",
      economicCode: "",
      registrationCode: "",
      website: "",
      documents: {
        image: "",
        word: "",
        pdf: "",
      },
    });
    setFocused({
      name: false,
      lastName: false,
      phoneNumber: false,
      nationalCode: false,
      gender: false,
      date: false,
      education: false,
      nickname: false,
      bio: false,
      businessId: false,
      roleInCompany: false,
      description: false,
      specialty: false,
      skillLevel: false,
      workExperience: false,
      department: false,
      resumeFile: false,
      attachmentFile: false,
      cooperationType: false,
      requestTitle: false,
      projectType: false,
      timePeriod: false,
      requestAmount: false,
      requestDescription: false,
      code: false,
      companyName: false,
      companyRegCode: false,
      email: false,
      job: false,
      businessType: false,
      activityField: false,
      taxCode: false,
      province: false,
      city: false,
      address: false,
      clubInterested: false,
      productType: false,
      onlineOffline: false,
      serviceDescription: false,
      economicCode: false,
      registrationCode: false,
      website: false,
      documents: {
        image: false,
        word: false,
        pdf: false,
      },
    });
    setIsEditing({
      name: false,
      lastName: false,
      phoneNumber: false,
      nationalCode: false,
      gender: false,
      date: false,
      education: false,
      nickname: false,
      bio: false,
      businessId: false,
      roleInCompany: false,
      description: false,
      specialty: false,
      skillLevel: false,
      workExperience: false,
      department: false,
      resumeFile: false,
      attachmentFile: false,
      cooperationType: false,
      requestTitle: false,
      projectType: false,
      timePeriod: false,
      requestAmount: false,
      requestDescription: false,
      code: false,
      companyName: false,
      companyRegCode: false,
      email: false,
      job: false,
      businessType: false,
      activityField: false,
      taxCode: false,
      province: false,
      city: false,
      address: false,
      clubInterested: false,
      productType: false,
      onlineOffline: false,
      serviceDescription: false,
      economicCode: false,
      registrationCode: false,
      website: false,
      documents: {
        image: false,
        word: false,
        pdf: false,
      },
    });
  };

  return {
    values,
    errors,
    focused,
    isEditing,
    handleChange,
    handleDocumentChange,
    handleFocus,
    handleDocumentFocus,
    handleBlur,
    handleDocumentBlur,
    resetForm,
    setErrors,
  };
}
