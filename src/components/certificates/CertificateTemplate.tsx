import type { CertificateTemplateProps } from '@/repositories/certificates/types';

/**
 * CertificateTemplate
 *
 * Renders a certificate of completion that matches the CST branded design:
 * - Dark navy top & bottom bars
 * - Gold gradient bottom bar
 * - Geometric star-pattern background
 * - Gold double-border frame
 * - "CERTIFICATE OF COMPLETION" heading
 * - Student name, course, signatures, logo
 */
const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
    student_name,
    course_title,
    platform_name,
    instructor_name,
    instructor_signature,
    platform_logo,
    platform_signature,
    administrator_name,
}) => {
    return (
        <div
            className="certificate-root"
            style={{
                width: '900px',
                aspectRatio: '10 / 7.1',
                position: 'relative',
                fontFamily: "'Georgia', 'Times New Roman', serif",
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                borderRadius: '4px',
            }}
        >
            {/* ─── SVG geometric pattern background ─── */}
            <svg
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id="cert-geo"
                        x="0"
                        y="0"
                        width="60"
                        height="60"
                        patternUnits="userSpaceOnUse"
                    >
                        {/* Hexagonal / star geometric pattern */}
                        <polygon
                            points="30,2 38,18 56,18 42,30 47,48 30,38 13,48 18,30 4,18 22,18"
                            fill="none"
                            stroke="rgba(180,180,180,0.18)"
                            strokeWidth="0.7"
                        />
                        <circle
                            cx="30"
                            cy="30"
                            r="8"
                            fill="none"
                            stroke="rgba(180,180,180,0.12)"
                            strokeWidth="0.5"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="#fafafa" />
                <rect width="100%" height="100%" fill="url(#cert-geo)" />
            </svg>

            {/* ─── Navy top bar ─── */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '38px',
                    background:
                        'linear-gradient(135deg, #0f1f3e 0%, #1a3160 50%, #0f1f3e 100%)',
                    zIndex: 2,
                }}
            />

            {/* ─── Navy bottom bar ─── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '38px',
                    background:
                        'linear-gradient(135deg, #0f1f3e 0%, #1a3160 50%, #0f1f3e 100%)',
                    zIndex: 2,
                }}
            />

            {/* ─── Gold gradient bar (just above bottom navy bar) ─── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '38px',
                    left: 0,
                    right: 0,
                    height: '28px',
                    background:
                        'linear-gradient(90deg, #b8860b 0%, #daa520 25%, #f0c040 50%, #daa520 75%, #b8860b 100%)',
                    zIndex: 2,
                }}
            />

            {/* ─── Gold double-line border frame ─── */}
            <div
                style={{
                    position: 'absolute',
                    top: '50px',
                    left: '48px',
                    right: '48px',
                    bottom: '78px',
                    border: '2px solid #c5a24d',
                    borderRadius: '2px',
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        right: '6px',
                        bottom: '6px',
                        border: '1px solid #c5a24d',
                        borderRadius: '1px',
                    }}
                />
            </div>

            {/* ─── Corner flourishes (top-left, top-right, bottom-left, bottom-right) ─── */}
            {/* Top-left */}
            <svg
                style={{
                    position: 'absolute',
                    top: '42px',
                    left: '40px',
                    width: '70px',
                    height: '70px',
                    zIndex: 3,
                }}
                viewBox="0 0 70 70"
            >
                <path
                    d="M8,35 Q8,8 35,8"
                    fill="none"
                    stroke="#c5a24d"
                    strokeWidth="2"
                />
                <path
                    d="M14,35 Q14,14 35,14"
                    fill="none"
                    stroke="#c5a24d"
                    strokeWidth="1"
                />
            </svg>
            {/* Top-right */}
            <svg
                style={{
                    position: 'absolute',
                    top: '42px',
                    right: '40px',
                    width: '70px',
                    height: '70px',
                    zIndex: 3,
                    transform: 'scaleX(-1)',
                }}
                viewBox="0 0 70 70"
            >
                <path
                    d="M8,35 Q8,8 35,8"
                    fill="none"
                    stroke="#c5a24d"
                    strokeWidth="2"
                />
                <path
                    d="M14,35 Q14,14 35,14"
                    fill="none"
                    stroke="#c5a24d"
                    strokeWidth="1"
                />
            </svg>
            {/* Bottom-left */}
            <svg
                style={{
                    position: 'absolute',
                    bottom: '70px',
                    left: '40px',
                    width: '70px',
                    height: '70px',
                    zIndex: 3,
                    transform: 'scaleY(-1)',
                }}
                viewBox="0 0 70 70"
            >
                <path
                    d="M8,35 Q8,8 35,8"
                    fill="none"
                    stroke="#c5a24d"
                    strokeWidth="2"
                />
                <path
                    d="M14,35 Q14,14 35,14"
                    fill="none"
                    stroke="#c5a24d"
                    strokeWidth="1"
                />
            </svg>
            {/* Bottom-right */}
            <svg
                style={{
                    position: 'absolute',
                    bottom: '70px',
                    right: '40px',
                    width: '70px',
                    height: '70px',
                    zIndex: 3,
                    transform: 'scale(-1,-1)',
                }}
                viewBox="0 0 70 70"
            >
                <path
                    d="M8,35 Q8,8 35,8"
                    fill="none"
                    stroke="#c5a24d"
                    strokeWidth="2"
                />
                <path
                    d="M14,35 Q14,14 35,14"
                    fill="none"
                    stroke="#c5a24d"
                    strokeWidth="1"
                />
            </svg>

            {/* ─── Main Content ─── */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '60px 80px 90px',
                    textAlign: 'center',
                }}
            >
                {/* CERTIFICATE heading */}
                <h1
                    style={{
                        fontSize: '62px',
                        fontWeight: 700,
                        color: '#0f1f3e',
                        letterSpacing: '6px',
                        lineHeight: 1,
                        marginBottom: '0px',
                        fontFamily:
                            "'Georgia', 'Playfair Display', 'Times New Roman', serif",
                        textTransform: 'uppercase',
                    }}
                >
                    CERTIFICATE
                </h1>

                {/* OF COMPLETION */}
                <p
                    style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#b8860b',
                        letterSpacing: '5px',
                        marginTop: '2px',
                        marginBottom: '22px',
                        textTransform: 'uppercase',
                        fontFamily:
                            "'Georgia', 'Playfair Display', 'Times New Roman', serif",
                    }}
                >
                    OF COMPLETION
                </p>

                {/* "This certificate is proudly presented to" */}
                <p
                    style={{
                        fontSize: '15px',
                        color: '#1a3160',
                        fontStyle: 'italic',
                        marginBottom: '10px',
                        fontFamily: "'Georgia', 'Times New Roman', serif",
                    }}
                >
                    This certificate is proudly presented to
                </p>

                {/* Student name */}
                <h2
                    style={{
                        fontSize: '34px',
                        fontWeight: 700,
                        color: '#0f1f3e',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        marginBottom: '14px',
                        fontFamily:
                            "'Georgia', 'Playfair Display', 'Times New Roman', serif",
                    }}
                >
                    {student_name.toUpperCase()}
                </h2>

                {/* Gold divider line */}
                <div
                    style={{
                        width: '70%',
                        height: '1.5px',
                        background:
                            'linear-gradient(90deg, transparent 0%, #c5a24d 20%, #c5a24d 80%, transparent 100%)',
                        marginBottom: '16px',
                    }}
                />

                {/* Certificate from ... */}
                <p
                    style={{
                        fontSize: '14px',
                        color: '#1a3160',
                        fontStyle: 'italic',
                        marginBottom: '3px',
                        fontFamily: "'Georgia', 'Times New Roman', serif",
                    }}
                >
                    A certificate from {platform_name}.
                </p>

                {/* Course completion */}
                <p
                    style={{
                        fontSize: '14px',
                        color: '#1a3160',
                        fontStyle: 'italic',
                        marginBottom: '28px',
                        fontFamily: "'Georgia', 'Times New Roman', serif",
                    }}
                >
                    Course completion: {course_title}.
                </p>

                {/* ─── Bottom section: signatures + logo ─── */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        gap: '40px',
                        width: '100%',
                        marginTop: 'auto',
                    }}
                >
                    {/* Left signature - Instructor / Training Supervisor */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '180px',
                        }}
                    >
                        {/* Signature image or cursive name */}
                        {instructor_signature ? (
                            <img
                                src={instructor_signature}
                                alt={`${instructor_name} signature`}
                                style={{
                                    height: '48px',
                                    objectFit: 'contain',
                                    marginBottom: '4px',
                                }}
                            />
                        ) : (
                            <span
                                style={{
                                    fontFamily:
                                        "'Segoe Script', 'Dancing Script', 'Brush Script MT', cursive",
                                    fontSize: '28px',
                                    color: '#1a3160',
                                    lineHeight: 1.2,
                                    marginBottom: '4px',
                                }}
                            >
                                {instructor_name || 'Instructor'}
                            </span>
                        )}
                        {/* Gold line under signature */}
                        <div
                            style={{
                                width: '160px',
                                height: '1.5px',
                                backgroundColor: '#c5a24d',
                                marginBottom: '6px',
                            }}
                        />
                        <span
                            style={{
                                fontSize: '13px',
                                fontWeight: 700,
                                color: '#0f1f3e',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}
                        >
                            {instructor_name?.toUpperCase() || 'INSTRUCTOR'}
                        </span>
                        <span
                            style={{
                                fontSize: '11px',
                                color: '#555',
                                marginTop: '1px',
                            }}
                        >
                            Training Supervisor
                        </span>
                    </div>

                    {/* Center logo */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '100px',
                        }}
                    >
                        {platform_logo ? (
                            <img
                                src={platform_logo}
                                alt={platform_name}
                                style={{
                                    height: '80px',
                                    width: '80px',
                                    objectFit: 'contain',
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    backgroundColor: '#0f1f3e',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#daa520',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    lineHeight: 1.2,
                                    padding: '8px',
                                }}
                            >
                                {platform_name}
                            </div>
                        )}
                    </div>

                    {/* Right signature - Administrator */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '180px',
                        }}
                    >
                        {/* Signature image or cursive name */}
                        {platform_signature ? (
                            <img
                                src={platform_signature}
                                alt={`${administrator_name} signature`}
                                style={{
                                    height: '48px',
                                    objectFit: 'contain',
                                    marginBottom: '4px',
                                }}
                            />
                        ) : (
                            <span
                                style={{
                                    fontFamily:
                                        "'Segoe Script', 'Dancing Script', 'Brush Script MT', cursive",
                                    fontSize: '28px',
                                    color: '#1a3160',
                                    lineHeight: 1.2,
                                    marginBottom: '4px',
                                }}
                            >
                                {administrator_name || 'Administrator'}
                            </span>
                        )}
                        {/* Gold line under signature */}
                        <div
                            style={{
                                width: '160px',
                                height: '1.5px',
                                backgroundColor: '#c5a24d',
                                marginBottom: '6px',
                            }}
                        />
                        <span
                            style={{
                                fontSize: '13px',
                                fontWeight: 700,
                                color: '#0f1f3e',
                                letterSpacing: '0.5px',
                            }}
                        >
                            {administrator_name || 'Administrator'}
                        </span>
                        <span
                            style={{
                                fontSize: '11px',
                                color: '#555',
                                marginTop: '1px',
                            }}
                        >
                            Corporate Administrator
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateTemplate;
