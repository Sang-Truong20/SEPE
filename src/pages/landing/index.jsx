import { useMutation } from '@tanstack/react-query';
import { Form } from 'antd';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import Footer from '../../components/layouts/Footer';
import UserDropdown from '../../components/layouts/UserDropdown';
import { PATH_NAME } from '../../constants';
import { useLogout } from '../../hooks/useLogout';
import { useUserData } from '../../hooks/useUserData';
import { loginGoogle } from '../../services/auth';
import { notify } from '../../utils/index';
import Login from '../../components/login';

const SEALLandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [form] = Form.useForm();
  const { userInfo } = useUserData();
  const { logout } = useLogout();

  const handleFinish = (values) => {
    mutateLoginGoogle(values.email);
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out',
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { mutate: mutateLoginGoogle, isPending } = useMutation({
    mutationFn: loginGoogle,
    onSuccess: (res) => {
      const accessToken = res?.data?.accessToken;
      const refreshToken = res?.data?.refreshToken;
      console.log(res);


      if (accessToken && refreshToken) {
        Cookies.set('accessToken', accessToken);
        Cookies.set('refreshToken', refreshToken);
        const decoded = jwtDecode(accessToken);
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        console.log(role);

        if (role === 'Admin') {
          window.location.href = PATH_NAME.ADMIN;
        }
        if (role === 'Partner') {
          window.location.href = PATH_NAME.PARTNER;
        }
        if (role === 'Judge') {
          window.location.href = PATH_NAME.JUDGE;
        }
        else {
          window.location.href = PATH_NAME.HOME;
        }
      }
    },
    onError: () => {
      notify('error', { description: 'Lỗi hệ thống' });
    },
  });

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? 'bg-black/90 backdrop-blur-lg py-4'
          : 'bg-transparent py-6'
          }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <span className="font-bold text-2xl">SEAL</span>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="hover:text-primary transition-colors">
                Trang chủ
              </a>
              <a
                href="#features"
                className="hover:text-primary transition-colors"
              >
                Tính năng
              </a>
              <a
                href="#hackathons"
                className="hover:text-primary transition-colors"
              >
                Hackathon
              </a>
              <a
                href="#timeline"
                className="hover:text-primary transition-colors"
              >
                Dòng thời gian
              </a>
              <a href="#faq" className="hover:text-primary transition-colors">
                FAQ
              </a>

              {userInfo ? (
                <>
                  <UserDropdown onLogout={logout} />
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:scale-105"
                >
                  Tham gia ngay
                </button>
              )}
            </div>

            <button className="lg:hidden">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center grid-pattern"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>

        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3s' }}
        ></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div data-aos="fade-down" className="mb-6">
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                🚀 Đại học FPT HCM
              </span>
            </div>

            <h1
              data-aos="fade-up"
              className="text-6xl md:text-8xl font-black mb-6 leading-tight"
            >
              SEAL <span className="text-gradient">Hackathon</span>
              <br />
              Hệ thống quản lý
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
            >
              Đổi mới quản lý hackathon học thuật với sự công bằng, minh bạch và
              tự động hóa
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="flex flex-wrap gap-6 justify-center"
            >
              <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform hover-glow">
                Bắt đầu →
              </button>
              <button className="border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                Xem demo
              </button>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">3</div>
                <div className="text-gray-400">Sự kiện thường niên</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">500+</div>
                <div className="text-gray-400">Người tham gia</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">100+</div>
                <div className="text-gray-400">Đội thi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20" data-aos="fade-up">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Tính năng nổi bật</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Nền tảng quản lý hackathon toàn diện – công bằng, minh bạch, và dễ
              sử dụng
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: 'Quản lý từ A-Z',
                desc: 'Hệ thống quản lý toàn bộ quy trình hackathon: đăng ký, chia đội, chấm điểm và trao giải.',
                icon: '⚡',
              },
              {
                title: 'Tự động & Minh bạch',
                desc: 'Tự động hóa quy trình, minh bạch trong chấm điểm và quản lý dữ liệu.',
                icon: '🔒',
              },
              {
                title: 'Trải nghiệm hiện đại',
                desc: 'Giao diện tối ưu, dễ dùng cho cả ban tổ chức, mentor và thí sinh.',
                icon: '🎯',
              },
            ].map((feature, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="card-gradient p-8 rounded-2xl hover-glow transition-all hover:scale-105"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="hackathons"
        className="py-32 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-20" data-aos="fade-up">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Ba mùa Hackathon</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Mỗi mùa mang đến chủ đề, thử thách và cơ hội riêng biệt
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                season: 'Mùa 1',
                title: 'Khởi động',
                desc: 'Khám phá ý tưởng và thử sức với các đề tài công nghệ mới.',
              },
              {
                season: 'Mùa 2',
                title: 'Bứt phá',
                desc: 'Phát triển sản phẩm thực tế, ứng dụng vào đời sống.',
              },
              {
                season: 'Mùa 3',
                title: 'Đỉnh cao',
                desc: 'Tranh tài cùng các đội mạnh nhất để giành giải thưởng lớn.',
              },
            ].map((hackathon, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="p-8 rounded-2xl border border-white/10 hover:bg-white/5 transition-all"
              >
                <span className="text-primary font-bold">
                  {hackathon.season}
                </span>
                <h3 className="text-2xl font-bold mt-4 mb-4">
                  {hackathon.title}
                </h3>
                <p className="text-gray-400">{hackathon.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="timeline" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20" data-aos="fade-up">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Dòng thời gian</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Hành trình của bạn tại SEAL 2024
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {[
              {
                date: 'Tháng 5',
                title: 'Mở đăng ký',
                desc: 'Các đội bắt đầu đăng ký tham gia.',
              },
              {
                date: 'Tháng 6',
                title: 'Vòng loại',
                desc: 'Thí sinh thi đấu loại trực tuyến.',
              },
              {
                date: 'Tháng 7',
                title: 'Chung kết',
                desc: 'Các đội xuất sắc tranh tài tại sân khấu chính.',
              },
            ].map((event, i) => (
              <div
                key={i}
                className="mb-12 flex items-start"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="w-32 font-bold text-primary">{event.date}</div>
                <div className="flex-1 p-6 rounded-xl card-gradient">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-400">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12 text-center">
          {[
            { number: '500+', label: 'Tổng số người tham gia' },
            { number: '120+', label: 'Đội thi đã lập' },
            { number: '30+', label: 'Chuyên gia mentor' },
            { number: '200 Triệu+', label: 'Tổng giá trị giải thưởng' },
          ].map((stat, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={i * 100}>
              <div className="text-5xl font-bold text-primary mb-4">
                {stat.number}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="py-32 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-20" data-aos="fade-up">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Câu hỏi thường gặp</span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'Ai có thể tham gia Hackathon SEAL?',
                a: 'Sinh viên FPT HCM hoặc các trường đại học liên kết đều có thể đăng ký.',
              },
              {
                q: 'Một đội có bao nhiêu thành viên?',
                a: 'Mỗi đội có từ 3 đến 5 thành viên.',
              },
              {
                q: 'Có giới hạn đề tài không?',
                a: 'Không, miễn là ý tưởng phù hợp với chủ đề chính của hackathon.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="p-6 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
              >
                <h3 className="text-xl font-bold mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2
            className="text-4xl md:text-6xl font-bold mb-6"
            data-aos="fade-up"
          >
            Sẵn sàng <span className="text-gradient">bứt phá</span> tại
            Hackathon?
          </h2>
          <p
            className="text-gray-400 text-lg max-w-2xl mx-auto mb-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Đăng ký ngay hôm nay để cùng đồng đội chinh phục thử thách công nghệ
          </p>
          <div data-aos="fade-up" data-aos-delay="200">
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-primary text-white px-10 py-5 rounded-xl font-bold text-lg hover:scale-105 transition-transform hover-glow"
            >
              Đăng ký đội thi
            </button>
          </div>
        </div>
      </section>
      <Footer />

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-black border border-white/20 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl"></div>

            <div className="relative p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-black text-2xl">S</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  Tham gia <span className="text-gradient">SEAL</span>
                </h2>
                <p className="text-gray-400">
                  Đăng ký để trải nghiệm hackathon đỉnh cao
                </p>
              </div>

              {/* <div className="space-y-6">
                <Form
                  form={form}
                  onFinish={handleFinish}
                  layout="vertical"
                  className="space-y-4"
                >
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập email',
                      },
                      {
                        type: 'email',
                        message: 'Email không hợp lệ',
                      },
                    ]}
                  >
                    <Input
                      type="email"
                      placeholder="Nhập email của bạn"
                      size="large"
                      className="bg-white/5 h-14 border-white/20 text-white placeholder-gray-400 hover:border-green-500 focus:border-green-500 focus:shadow-none"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        borderRadius: '8px',
                      }}
                    />
                  </Form.Item>

                  <Form.Item>
                    
                  </Form.Item>
                </Form>

                <p className="text-xs text-gray-500 text-center">
                  Khi đăng ký, bạn đồng ý với{' '}
                  <a href="#" className="text-green-500 hover:underline">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="#" className="text-green-500 hover:underline">
                    Chính sách bảo mật
                  </a>{' '}
                  của chúng tôi
                </p>
              </div> */}
                <div className="flex justify-center w-full">
                  <Login/>
                </div>


              {/* Lợi ích */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm mb-4">Bạn sẽ nhận được:</p>
                <div className="space-y-2">
                  {[
                    'Tham gia toàn bộ 3 hackathon thường niên',
                    'Được mentor hỗ trợ và hướng dẫn chuyên sâu',
                    'Kết nối với các chuyên gia trong ngành',
                    'Cơ hội giành những giải thưởng hấp dẫn',
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEALLandingPage;
