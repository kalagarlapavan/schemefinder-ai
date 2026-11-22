-- SchemeFinder AI - Seed Data
-- Verified government schemes with official sources
-- Run this AFTER schema.sql in Supabase SQL Editor

INSERT INTO schemes (
    name, description, category, min_age, max_age, max_annual_income,
    eligible_occupations, eligible_states, eligible_education,
    benefits, documents_required, application_procedure,
    official_url, source_url, is_central, is_active
) VALUES

-- 1. PM-KISAN Samman Nidhi
(
    'PM-KISAN Samman Nidhi',
    'Pradhan Mantri Kisan Samman Nidhi provides income support of ₹6,000 per year to all landholding farmer families across India. The amount is paid in three equal installments of ₹2,000 every four months directly into the farmer''s bank account.',
    'Agriculture',
    18, 100,
    9999999999,
    ARRAY['Farmer', 'Agriculture'],
    ARRAY['all'],
    ARRAY['all'],
    '₹6,000 per year paid as three installments of ₹2,000 every four months via Direct Benefit Transfer (DBT) to the farmer''s registered bank account.',
    ARRAY['Aadhaar Card', 'Land ownership records (Khasra/Khatauni)', 'Bank account passbook', 'Mobile number'],
    'Register at the official PM-KISAN portal (pmkisan.gov.in) or visit your nearest Common Service Centre (CSC). Complete e-KYC via OTP or biometric authentication.',
    'https://pmkisan.gov.in',
    'https://pmkisan.gov.in/Documents/Revised_PM-KISAN_Operational_Guidelines.pdf',
    TRUE, TRUE
),

-- 2. Ayushman Bharat PM-JAY
(
    'Ayushman Bharat PM-JAY',
    'Pradhan Mantri Jan Arogya Yojana (PM-JAY) provides health insurance coverage of up to ₹5 lakh per family per year for secondary and tertiary hospitalization. All senior citizens aged 70+ are universally eligible regardless of income.',
    'Health',
    0, 120,
    300000,
    ARRAY['Daily Wage Worker', 'Domestic Worker', 'Street Vendor', 'Construction Worker', 'Farmer', 'Artisan', 'Other'],
    ARRAY['all'],
    ARRAY['all'],
    '₹5 lakh per family per year health insurance coverage for hospitalization at empanelled government and private hospitals. Cashless treatment at 25,000+ hospitals across India.',
    ARRAY['Aadhaar Card', 'Ration Card (AAY/BPL)', 'Mobile number'],
    'Check eligibility at pmjay.gov.in using Aadhaar or ration card number. If eligible, generate Ayushman Card at the nearest CSC or empanelled hospital.',
    'https://pmjay.gov.in',
    'https://pmjay.gov.in/about/pmjay',
    TRUE, TRUE
),

-- 3. Pradhan Mantri Awas Yojana - Urban
(
    'Pradhan Mantri Awas Yojana - Urban (PMAY-U)',
    'PMAY-Urban aims to provide affordable housing to Economically Weaker Section (EWS), Lower Income Group (LIG), and Middle Income Group (MIG) families who do not own a pucca house anywhere in India.',
    'Housing',
    18, 100,
    900000,
    ARRAY['all'],
    ARRAY['all'],
    ARRAY['all'],
    'Interest subsidy on home loans: EWS/LIG families get up to 6.5% subsidy. MIG-I get 4% subsidy and MIG-II get 3% subsidy. Maximum subsidy amount: ₹2.67 lakh for EWS/LIG.',
    ARRAY['Aadhaar Card', 'PAN Card', 'Income proof (salary slips or ITR)', 'Bank statements (6 months)', 'Affidavit of not owning a pucca house', 'Property documents (if constructing)'],
    'Apply online at pmaymis.gov.in or visit an empanelled bank or Primary Lending Institution (PLI). Submit application with required documents and claim interest subsidy.',
    'https://pmaymis.gov.in',
    'https://pmay-urban.gov.in/',
    TRUE, TRUE
),

-- 4. Central Sector Scheme of Scholarships (CSSS)
(
    'Central Sector Scheme of Scholarships (CSSS)',
    'Merit-based scholarship for students in the top 20th percentile of their Class 12 board examination, pursuing regular full-time undergraduate or postgraduate courses at recognized colleges and universities.',
    'Education',
    17, 25,
    450000,
    ARRAY['Student'],
    ARRAY['all'],
    ARRAY['12th Pass', 'Graduate', 'Post Graduate'],
    '₹10,000 per year for first three years of undergraduate studies; ₹20,000 per year for 4th and 5th year professional courses; ₹20,000 per year for postgraduate studies.',
    ARRAY['Aadhaar Card', 'Class 12 marksheet', 'Income certificate (annual family income proof)', 'Admission proof from college/university', 'Bank account passbook', 'Caste certificate (if applicable)'],
    'Register on the National Scholarship Portal (scholarships.gov.in), complete One Time Registration (OTR) with Aadhaar, fill application form, and submit with verified documents.',
    'https://scholarships.gov.in',
    'https://scholarships.gov.in/fresh/newstdRegisInstruction',
    TRUE, TRUE
),

-- 5. Post-Matric Scholarship for SC Students
(
    'Post-Matric Scholarship for SC Students',
    'Scholarship for Scheduled Caste students studying at post-matriculation level (Class 11 and above) to enable them to complete their education. Covers tuition fees, maintenance allowance, and other educational expenses.',
    'Education',
    14, 30,
    250000,
    ARRAY['Student'],
    ARRAY['all'],
    ARRAY['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Diploma'],
    'Full tuition fees reimbursement + maintenance allowance of ₹1,200–₹1,500 per month (hostellers) or ₹550–₹750 per month (day scholars) depending on the course level.',
    ARRAY['Aadhaar Card', 'Caste certificate (SC certificate from competent authority)', 'Previous year marksheet (minimum 50% marks)', 'Income certificate (family income below ₹2.5 lakh/year)', 'Admission fee receipt', 'Bank account passbook'],
    'Apply through the National Scholarship Portal (scholarships.gov.in) or State Scholarship Portal. Documents must be verified by the institution.',
    'https://scholarships.gov.in',
    'https://socialjustice.gov.in/schemes/22',
    TRUE, TRUE
),

-- 6. Pradhan Mantri Mudra Yojana (PMMY)
(
    'Pradhan Mantri Mudra Yojana (PMMY)',
    'Provides collateral-free loans to non-corporate, non-farm small and micro enterprises. Three categories: Shishu (up to ₹50,000), Kishore (₹50,001 to ₹5 lakh), and Tarun (₹5 lakh to ₹10 lakh).',
    'Business & Entrepreneurship',
    18, 65,
    9999999999,
    ARRAY['Business Owner', 'Self-employed', 'Entrepreneur', 'Artisan', 'Trader'],
    ARRAY['all'],
    ARRAY['all'],
    'Collateral-free business loans: Shishu: up to ₹50,000; Kishore: ₹50,001 to ₹5 lakh; Tarun: ₹5 lakh to ₹10 lakh. No processing fee for Shishu loans.',
    ARRAY['Aadhaar Card', 'PAN Card', 'Business plan or project report', 'Business registration proof (if existing)', 'Bank statements (6 months)', 'Proof of business address', 'Quotations for machinery/equipment (if applicable)'],
    'Apply at any public sector bank, private bank, microfinance institution, or NBFC. You can also apply online via Udyamimitra portal (udyamimitra.in).',
    'https://www.mudra.org.in',
    'https://www.mudra.org.in/Default',
    TRUE, TRUE
),

-- 7. Sukanya Samriddhi Yojana
(
    'Sukanya Samriddhi Yojana (SSY)',
    'Government savings scheme for the welfare of girl children. Parents or legal guardians can open an account in a girl child''s name (below 10 years of age) to secure her education and marriage expenses.',
    'Women & Child',
    0, 10,
    9999999999,
    ARRAY['all'],
    ARRAY['all'],
    ARRAY['all'],
    'Current interest rate: 8.2% per annum (compounded annually). Tax benefits under Section 80C. Maturity amount fully tax-exempt. Partial withdrawal allowed for education after girl turns 18.',
    ARRAY['Girl child''s birth certificate', 'Aadhaar Card of parent/guardian', 'PAN Card of parent/guardian', 'Identity and address proof of parent/guardian', 'Passport-size photograph'],
    'Open an account at any post office or authorized bank (State Bank of India, Bank of Baroda, Punjab National Bank, etc.). Minimum deposit: ₹250/year.',
    'https://www.india.gov.in/spotlight/sukanya-samriddhi-yojana',
    'https://dbie.rbi.org.in/DBIE/dbie.rbi?site=SBR&requestType=getDetails&reportingEntity=sukanya',
    TRUE, TRUE
),

-- 8. National Old Age Pension Scheme (NOAPS)
(
    'National Old Age Pension Scheme (NOAPS)',
    'Provides monthly pension to senior citizens aged 60 years and above who belong to Below Poverty Line (BPL) households. Part of the National Social Assistance Programme (NSAP).',
    'Social Welfare',
    60, 120,
    9999999999,
    ARRAY['all'],
    ARRAY['all'],
    ARRAY['all'],
    '₹200 per month for beneficiaries aged 60–79 years; ₹500 per month for beneficiaries aged 80 years and above. Amount transferred directly to bank account.',
    ARRAY['Aadhaar Card', 'Age proof (birth certificate, school leaving certificate, or Aadhaar)', 'BPL certificate or ration card', 'Bank account passbook', 'Passport-size photograph'],
    'Apply through your state government''s Social Welfare Department or the NSAP portal (nsap.nic.in). Applications can also be submitted at Gram Panchayat offices (rural) or ward offices (urban).',
    'https://nsap.nic.in',
    'https://nsap.nic.in/nsap/front/staticPage.do?path=ignoaps',
    TRUE, TRUE
),

-- 9. PM SVANidhi (PM Street Vendor''s AtmaNirbhar Nidhi)
(
    'PM SVANidhi – Street Vendor Loan Scheme',
    'Provides affordable working capital loans to street vendors to restart their livelihoods affected by the COVID-19 pandemic. Eligible vendors can avail collateral-free loans with interest subsidy.',
    'Business & Entrepreneurship',
    18, 65,
    9999999999,
    ARRAY['Street Vendor', 'Daily Wage Worker', 'Self-employed'],
    ARRAY['all'],
    ARRAY['all'],
    'First loan: ₹10,000; Second loan: ₹20,000; Third loan: ₹50,000. 7% interest subsidy credited quarterly to bank account. No collateral required.',
    ARRAY['Aadhaar Card', 'Vending certificate or identity card issued by Urban Local Body (ULB)', 'Letter of Recommendation (LoR) from ULB or Town Vending Committee', 'Bank account details', 'Mobile number'],
    'Apply online at pmsvanidhi.mohua.gov.in or visit the nearest Urban Local Body office. Loans disbursed through partner banks, MFIs, and SHG banks.',
    'https://pmsvanidhi.mohua.gov.in',
    'https://pmsvanidhi.mohua.gov.in/Schemes',
    TRUE, TRUE
),

-- 10. Kisan Credit Card (KCC)
(
    'Kisan Credit Card (KCC)',
    'Provides farmers with timely and adequate credit support for their agricultural needs including crop cultivation, maintenance of farm assets, and ancillary activities. Also covers allied activities and non-farm activities.',
    'Agriculture',
    18, 75,
    9999999999,
    ARRAY['Farmer', 'Agriculture', 'Fisherman'],
    ARRAY['all'],
    ARRAY['all'],
    'Credit limit based on landholding and crop requirement. Interest rate as low as 7% per annum (with 3% interest subvention making effective rate 4% for timely repayment). No collateral required for loans up to ₹1.6 lakh.',
    ARRAY['Aadhaar Card', 'Land records (Khasra/Khatauni or land passbook)', 'Passport-size photograph', 'Bank account details', 'Identity proof (Voter ID, PAN Card)'],
    'Apply at the nearest bank branch (nationalized banks, cooperative banks, or RRBs). Fill the KCC application form and submit with land records. Banks process within 2 weeks.',
    'https://pmkisan.gov.in',
    'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11862',
    TRUE, TRUE
),

-- 11. National Apprenticeship Promotion Scheme (NAPS)
(
    'National Apprenticeship Promotion Scheme (NAPS)',
    'Promotes apprenticeship training in India by providing financial support to employers for engaging apprentices. Apprentices get hands-on training in a trade/occupation and receive a stipend. Government reimburses 25% of prescribed stipend to employers.',
    'Skill Development',
    14, 35,
    9999999999,
    ARRAY['Student', 'Unemployed', 'Self-employed'],
    ARRAY['all'],
    ARRAY['8th Pass', '10th Pass', '12th Pass', 'Graduate', 'Diploma'],
    'Monthly stipend during training period (varies by trade). Government reimburses 25% of stipend (up to ₹1,500/month) to employers. Apprenticeship certificate from NCVT/SCVT after completion.',
    ARRAY['Aadhaar Card', 'Educational qualification certificates (Class 8/10/12 or ITI/Diploma/Degree)', 'Date of birth proof', 'Bank account passbook', 'Passport-size photograph'],
    'Register on the Apprenticeship India portal (apprenticeshipindia.gov.in). Search for apprenticeship vacancies, apply to establishments, and get placed.',
    'https://apprenticeshipindia.gov.in',
    'https://apprenticeshipindia.gov.in/naps',
    TRUE, TRUE
),

-- 12. Startup India Seed Fund Scheme
(
    'Startup India Seed Fund Scheme (SISFS)',
    'Provides financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization. Administered through DPIIT-recognized incubators.',
    'Business & Entrepreneurship',
    18, 60,
    9999999999,
    ARRAY['Business Owner', 'Entrepreneur', 'Self-employed'],
    ARRAY['all'],
    ARRAY['Graduate', 'Post Graduate'],
    'Up to ₹20 lakh as grant for validation and prototype development. Up to ₹50 lakh as convertible debentures or debt-linked instruments for market entry and commercialization.',
    ARRAY['Startup India DPIIT Recognition Certificate', 'Business plan or pitch deck', 'Proof of incorporation (MCA Certificate of Incorporation)', 'Team details and founder profiles', 'Prototype or MVP demonstration'],
    'Apply through DPIIT-recognized incubators listed on the Startup India portal (startupindia.gov.in/content/sai/en/startup-india-seed-fund-scheme.html). Incubators evaluate and disburse funds.',
    'https://www.startupindia.gov.in',
    'https://www.startupindia.gov.in/content/sai/en/startup-india-seed-fund-scheme.html',
    TRUE, TRUE
);
