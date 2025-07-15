import { CartRecommendation, Course, CartItem } from '../types';
import { courseService } from './courseService';

export class CartRecommendationService {
  private static instance: CartRecommendationService;
  
  public static getInstance(): CartRecommendationService {
    if (!CartRecommendationService.instance) {
      CartRecommendationService.instance = new CartRecommendationService();
    }
    return CartRecommendationService.instance;
  }

  /**
   * Lấy gợi ý khóa học dựa trên giỏ hàng
   */
  async getCartRecommendations(cartItems: CartItem[], limit: number = 6): Promise<CartRecommendation[]> {
    console.log('🔍 getCartRecommendations called with:', cartItems.length, 'items');
    
    if (cartItems.length === 0) {
      console.log('⚠️ No cart items, returning empty recommendations');
      return [];
    }

    const recommendations: CartRecommendation[] = [];
    const coursesResponse = await courseService.getAllCourses();
    const allCourses = coursesResponse.data;
    const cartCourseIds = cartItems.map(item => item.course.id);

    console.log('📚 Total courses available:', allCourses.length);
    console.log('🛒 Cart course IDs:', cartCourseIds);

    // 1. Gợi ý khóa học bổ sung (complementary) - cùng category nhưng khác level
    const complementaryRecommendations = this.getComplementaryRecommendations(
      cartItems,
      allCourses,
      cartCourseIds
    );
    console.log('🔄 Complementary recommendations:', complementaryRecommendations.length);
    recommendations.push(...complementaryRecommendations);

    // 2. Gợi ý khóa học tương tự (similar) - cùng category và level
    const similarRecommendations = this.getSimilarRecommendations(
      cartItems,
      allCourses,
      cartCourseIds
    );
    console.log('🔄 Similar recommendations:', similarRecommendations.length);
    recommendations.push(...similarRecommendations);

    // 3. Gợi ý khóa học nâng cao (advanced) - level cao hơn
    const advancedRecommendations = this.getAdvancedRecommendations(
      cartItems,
      allCourses,
      cartCourseIds
    );
    console.log('🔄 Advanced recommendations:', advancedRecommendations.length);
    recommendations.push(...advancedRecommendations);

    // 4. Gợi ý khóa học cơ bản (beginner) - level thấp hơn
    const beginnerRecommendations = this.getBeginnerRecommendations(
      cartItems,
      allCourses,
      cartCourseIds
    );
    console.log('🔄 Beginner recommendations:', beginnerRecommendations.length);
    recommendations.push(...beginnerRecommendations);

    console.log('✅ Total recommendations before sorting:', recommendations.length);

    // Sắp xếp theo điểm số và giới hạn kết quả
    const finalRecommendations = recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    console.log('🎯 Final recommendations:', finalRecommendations.length, finalRecommendations);

    return finalRecommendations;
  }

  private getComplementaryRecommendations(
    cartItems: CartItem[],
    allCourses: Course[],
    cartCourseIds: string[]
  ): CartRecommendation[] {
    const recommendations: CartRecommendation[] = [];
    const categoryLevelMap = new Map<string, Set<string>>();

    // Tạo map category -> levels trong giỏ hàng
    cartItems.forEach(item => {
      const category = item.course.category;
      if (!categoryLevelMap.has(category)) {
        categoryLevelMap.set(category, new Set());
      }
      categoryLevelMap.get(category)!.add(item.course.level);
    });

    // Tìm khóa học cùng category nhưng khác level
    allCourses.forEach(course => {
      if (cartCourseIds.includes(course.id)) return;

      const courseLevels = categoryLevelMap.get(course.category);
      if (courseLevels && !courseLevels.has(course.level)) {
        const baseCourse = cartItems.find(item => item.course.category === course.category);
        if (baseCourse) {
          recommendations.push({
            courseId: course.id,
            score: 0.8 + (course.rating / 10) + (course.isPopular ? 0.1 : 0),
            reason: `Khóa học bổ sung cho ${course.category} - level ${course.level}`,
            type: 'complementary',
            basedOnCourseId: baseCourse.course.id
          });
        }
      }
    });

    return recommendations;
  }

  private getSimilarRecommendations(
    cartItems: CartItem[],
    allCourses: Course[],
    cartCourseIds: string[]
  ): CartRecommendation[] {
    const recommendations: CartRecommendation[] = [];

    cartItems.forEach(cartItem => {
      const similarCourses = allCourses.filter(course => 
        !cartCourseIds.includes(course.id) &&
        course.category === cartItem.course.category &&
        course.level === cartItem.course.level &&
        course.instructor !== cartItem.course.instructor
      );

      similarCourses.forEach(course => {
        // Tính toán điểm tương tự dựa trên tags
        const tagSimilarity = this.calculateTagSimilarity(cartItem.course.tags, course.tags);
        
        recommendations.push({
          courseId: course.id,
          score: 0.7 + tagSimilarity + (course.rating / 10),
          reason: `Khóa học tương tự ${cartItem.course.title}`,
          type: 'similar',
          basedOnCourseId: cartItem.course.id
        });
      });
    });

    return recommendations;
  }

  private getAdvancedRecommendations(
    cartItems: CartItem[],
    allCourses: Course[],
    cartCourseIds: string[]
  ): CartRecommendation[] {
    const recommendations: CartRecommendation[] = [];
    const levelOrder = ['beginner', 'intermediate', 'advanced'];

    cartItems.forEach(cartItem => {
      const currentLevelIndex = levelOrder.indexOf(cartItem.course.level);
      const nextLevelIndex = currentLevelIndex + 1;

      if (nextLevelIndex < levelOrder.length) {
        const nextLevel = levelOrder[nextLevelIndex];
        
        const advancedCourses = allCourses.filter(course =>
          !cartCourseIds.includes(course.id) &&
          course.category === cartItem.course.category &&
          course.level === nextLevel
        );

        advancedCourses.forEach(course => {
          recommendations.push({
            courseId: course.id,
            score: 0.75 + (course.rating / 10),
            reason: `Khóa học nâng cao sau ${cartItem.course.title}`,
            type: 'advanced',
            basedOnCourseId: cartItem.course.id
          });
        });
      }
    });

    return recommendations;
  }

  private getBeginnerRecommendations(
    cartItems: CartItem[],
    allCourses: Course[],
    cartCourseIds: string[]
  ): CartRecommendation[] {
    const recommendations: CartRecommendation[] = [];
    const levelOrder = ['beginner', 'intermediate', 'advanced'];

    cartItems.forEach(cartItem => {
      const currentLevelIndex = levelOrder.indexOf(cartItem.course.level);
      const prevLevelIndex = currentLevelIndex - 1;

      if (prevLevelIndex >= 0) {
        const prevLevel = levelOrder[prevLevelIndex];
        
        const beginnerCourses = allCourses.filter(course =>
          !cartCourseIds.includes(course.id) &&
          course.category === cartItem.course.category &&
          course.level === prevLevel
        );

        beginnerCourses.forEach(course => {
          recommendations.push({
            courseId: course.id,
            score: 0.6 + (course.rating / 10),
            reason: `Khóa học cơ bản trước ${cartItem.course.title}`,
            type: 'beginner',
            basedOnCourseId: cartItem.course.id
          });
        });
      }
    });

    return recommendations;
  }

  private calculateTagSimilarity(tags1: string[], tags2: string[]): number {
    if (tags1.length === 0 || tags2.length === 0) return 0;

    const intersection = tags1.filter(tag => tags2.includes(tag));
    const union = Array.from(new Set([...tags1, ...tags2]));

    return intersection.length / union.length;
  }

  /**
   * Lấy gợi ý dựa trên khóa học cụ thể
   */
  async getRecommendationsForCourse(courseId: string, limit: number = 4): Promise<CartRecommendation[]> {
    const coursesResponse = await courseService.getAllCourses();
    const allCourses = coursesResponse.data;
    const targetCourse = allCourses.find((c: Course) => c.id === courseId);
    
    if (!targetCourse) return [];

    const recommendations: CartRecommendation[] = [];

    // Tìm khóa học cùng category
    const relatedCourses = allCourses.filter((course: Course) => 
      course.id !== courseId &&
      course.category === targetCourse.category
    );

    relatedCourses.forEach((course: Course) => {
      let score = 0.5;
      let reason = `Khóa học cùng chủ đề ${targetCourse.category}`;
      let type: CartRecommendation['type'] = 'similar';

      // Tính toán điểm dựa trên level
      if (course.level === targetCourse.level) {
        score += 0.2;
        reason = `Khóa học cùng level ${course.level}`;
      } else if (course.level === 'advanced' && targetCourse.level === 'intermediate') {
        score += 0.15;
        reason = `Khóa học nâng cao tiếp theo`;
        type = 'advanced';
      } else if (course.level === 'intermediate' && targetCourse.level === 'beginner') {
        score += 0.15;
        reason = `Khóa học trung cấp tiếp theo`;
        type = 'advanced';
      }

      // Tính toán điểm dựa trên tags
      const tagSimilarity = this.calculateTagSimilarity(targetCourse.tags, course.tags);
      score += tagSimilarity * 0.3;

      // Tính toán điểm dựa trên rating
      score += course.rating / 10 * 0.1;

      // Bonus cho khóa học phổ biến
      if (course.isPopular) {
        score += 0.05;
      }

      recommendations.push({
        courseId: course.id,
        score,
        reason,
        type,
        basedOnCourseId: courseId
      });
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

export const cartRecommendationService = CartRecommendationService.getInstance();
